import { useState, useRef, useEffect } from 'react'
import styles from './ChatbotWidget.module.scss'
import { BOT_MESSAGES, detectLanguage, replyFor } from './botMessages.js'
import { AIAPI } from '../../services/api.js'

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: BOT_MESSAGES[lang].hello }
  ])
  const listRef = useRef(null)

  useEffect(()=>{
    if (listRef.current) { listRef.current.scrollTop = listRef.current.scrollHeight }
  }, [messages, open])

  function send(){
    const text = input.trim()
    if (!text) return
    setMessages(prev=>[...prev, { id: prev.length+1, from: 'you', text }])
    setInput('')
    setTimeout(async ()=>{
      const detected = detectLanguage(text) || lang
      try {
        const ai = await AIAPI.chat({ messages: [{ role: 'user', content: text }], lang: detected })
        setLang(detected)
        setMessages(prev=>[...prev, { id: prev.length+1, from: 'bot', text: ai.reply }])
      } catch {
        const fallback = replyFor(text, detected)
        setLang(detected)
        setMessages(prev=>[...prev, { id: prev.length+1, from: 'bot', text: fallback }])
      }
    }, 200)
  }

  return (
    <div className={styles.root}>
      {!open && (
        <div className={styles.nudge}>{BOT_MESSAGES[lang].nudge}</div>
      )}
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span>HopeLine Chatbot</span>
            <select value={lang} onChange={e=>{ setLang(e.target.value); setMessages([{ id: 1, from: 'bot', text: BOT_MESSAGES[e.target.value].hello }]) }} className={styles.lang}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div className={styles.list} ref={listRef}>
            {messages.map(m=> (
              <div key={m.id} className={`${styles.msg} ${m.from==='you'? styles.you : styles.bot}`}>{m.text}</div>
            ))}
          </div>
          <div className={styles.inputRow}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder={BOT_MESSAGES[lang].placeholder} onKeyDown={e=> e.key==='Enter' && send()} />
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      )}
      <button className={styles.fab} onClick={()=>setOpen(v=>!v)} aria-label="Chatbot">
        {open? '×' : '💬'}
      </button>
    </div>
  )
}


