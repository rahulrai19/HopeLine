import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# LangChain / Model
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

# Optional RAG
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    system_prompt: Optional[str] = None


app = FastAPI(title="HopeLine Python LLM Service")


def get_llm():
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        raise RuntimeError("Missing GROQ_API_KEY")
    return ChatGroq(temperature=0.3, groq_api_key=api_key, model_name=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"))


def get_retriever():
    chroma_dir = os.environ.get("CHROMA_DIR")
    if not chroma_dir or not os.path.exists(chroma_dir):
        return None
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    try:
        vectordb = Chroma(persist_directory=chroma_dir, embedding_function=embeddings)
        return vectordb.as_retriever()
    except Exception:
        return None


retriever = get_retriever()


@app.post("/chat")
def chat(req: ChatRequest):
    try:
        llm = get_llm()

        # If RAG is available, use a RetrievalQA chain; otherwise do direct chat
        if retriever is not None:
            prompt_templates = (
                "You are a compassionate mental health chatbot. Use the retrieved context when helpful, and avoid repetition.\n"
                "{context}\nUser: {question}\nAssistant:"
            )
            PROMPT = PromptTemplate(template=prompt_templates, input_variables=['context', 'question'])
            qa = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=retriever,
                chain_type_kwargs={"prompt": PROMPT},
            )
            last_user = next((m.content for m in reversed(req.messages) if m.role == 'user'), "Hello")
            answer = qa.run(last_user)
            return {"reply": answer}

        # Direct chat fallback
        messages = []
        sys = req.system_prompt or (
            "You are a supportive, concise, non-repetitive mental health companion."
            " Keep replies 2-4 sentences, add a next step, and avoid repeating prior assistant text."
        )
        messages.append(SystemMessage(content=sys))
        for m in req.messages:
            if m.role == 'user':
                messages.append(HumanMessage(content=m.content))
            elif m.role == 'assistant':
                messages.append(AIMessage(content=m.content))

        result = llm.invoke(messages)
        return {"reply": getattr(result, 'content', str(result))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run with: uvicorn server:app --host 0.0.0.0 --port 8001


