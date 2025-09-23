# Auto-generated from Mental_Health_Chatbot_GEN_AI.ipynb
# Concatenated code cells in original order.


# ==== Cell 0 ====
!pip install langchain_groq langchain_core langchain_community

# ==== Cell 1 ====
from langchain_groq import ChatGroq
llm = ChatGroq(
    temperature = 0,
    groq_api_key = "",
    model_name = "llama-3.3-70b-versatile"
)
result = llm.invoke("Who is lord Ram?")
print(result.content)

# ==== Cell 2 ====
!pip install pypdf

# ==== Cell 3 ====
!pip install chromadb

# ==== Cell 4 ====
!pip install sentence_transformers

# ==== Cell 5 ====
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
def initialize_llm():
  llm = ChatGroq(
    temperature = 0,
    groq_api_key = "",
    model_name = "llama-3.3-70b-versatile"
)
  return llm

def create_vector_db():
  loader = DirectoryLoader("/content/data/", glob = '*.pdf', loader_cls = PyPDFLoader)
  documents = loader.load()
  text_splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 50)
  texts = text_splitter.split_documents(documents)
  embeddings = HuggingFaceBgeEmbeddings(model_name = 'sentence-transformers/all-MiniLM-L6-v2')
  vector_db = Chroma.from_documents(texts, embeddings, persist_directory = './chroma_db')
  vector_db.persist()

  print("ChromaDB created and data saved")

  return vector_db

def setup_qa_chain(vector_db, llm):
  retriever = vector_db.as_retriever()
  prompt_templates = """ You are a compassionate mental health chatbot. Respond thoughtfully to the following question:
    {context}
    User: {question}
    Chatbot: """
  PROMPT = PromptTemplate(template = prompt_templates, input_variables = ['context', 'question'])

  qa_chain = RetrievalQA.from_chain_type(
      llm = llm,
      chain_type = "stuff",
      retriever = retriever,
      chain_type_kwargs = {"prompt": PROMPT}
  )
  return qa_chain


def main():
  print("Intializing Chatbot.........")
  llm = initialize_llm()

  db_path = "/content/chroma_db"

  if not os.path.exists(db_path):
    vector_db  = create_vector_db()
  else:
    embeddings = HuggingFaceBgeEmbeddings(model_name = 'sentence-transformers/all-MiniLM-L6-v2')
    vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)
  qa_chain = setup_qa_chain(vector_db, llm)

  while True:
    query = input("\nHuman: ")
    if query.lower()  == "exit":
      print("Chatbot: Take Care of yourself, Goodbye!")
      break
    response = qa_chain.run(query)
    print(f"Chatbot: {response}")

if __name__ == "__main__":
  main()

# ==== Cell 6 ====
!pip install gradio

# ==== Cell 7 ====
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import gradio as gr
def initialize_llm():
  llm = ChatGroq(
    temperature = 0,
    groq_api_key = "",
    model_name = "llama-3.3-70b-versatile"
)
  return llm

def create_vector_db():
  loader = DirectoryLoader("/content/data/", glob = '*.pdf', loader_cls = PyPDFLoader)
  documents = loader.load()
  text_splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 50)
  texts = text_splitter.split_documents(documents)
  embeddings = HuggingFaceBgeEmbeddings(model_name = 'sentence-transformers/all-MiniLM-L6-v2')
  vector_db = Chroma.from_documents(texts, embeddings, persist_directory = './chroma_db')
  vector_db.persist()

  print("ChromaDB created and data saved")

  return vector_db

def setup_qa_chain(vector_db, llm):
  retriever = vector_db.as_retriever()
  prompt_templates = """ You are a compassionate mental health chatbot. Respond thoughtfully to the following question:
    {context}
    User: {question}
    Chatbot: """
  PROMPT = PromptTemplate(template = prompt_templates, input_variables = ['context', 'question'])

  qa_chain = RetrievalQA.from_chain_type(
      llm = llm,
      chain_type = "stuff",
      retriever = retriever,
      chain_type_kwargs = {"prompt": PROMPT}
  )
  return qa_chain


print("Intializing Chatbot.........")
llm = initialize_llm()

db_path = "/content/chroma_db"

if not os.path.exists(db_path):
  vector_db  = create_vector_db()
else:
  embeddings = HuggingFaceBgeEmbeddings(model_name = 'sentence-transformers/all-MiniLM-L6-v2')
  vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)
qa_chain = setup_qa_chain(vector_db, llm)

def chatbot_response(user_input, history = []):
  if not user_input.strip():
    return "Please provide a valid input", history
  response = qa_chain.run(user_input)
  history.append((user_input, response))
  return "", history

with gr.Blocks(theme = 'Respair/Shiki@1.2.1') as app:
    gr.Markdown("# 🧠 Mental Health Chatbot 🤖")
    gr.Markdown("A compassionate chatbot designed to assist with mental well-being. Please note: For serious concerns, contact a professional.")

    chatbot = gr.ChatInterface(fn=chatbot_response, title="Mental Health Chatbot")

    gr.Markdown("This chatbot provides general support. For urgent issues, seek help from licensed professionals.")

app.launch()
