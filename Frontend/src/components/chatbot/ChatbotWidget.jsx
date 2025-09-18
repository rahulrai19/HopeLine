import { useState, useRef, useEffect } from 'react'
import styles from './ChatbotWidget.module.scss'

function botReply(userText) {
  if (!userText.trim()) return 'I am here to help. Tell me more.'
  if (/help|support/i.test(userText)) return 'You can choose Self Help, Peer Support, or Counselor from Support.'
  if (/anx/i.test(userText)) return 'Try a 5-minute breathing exercise in Self Help → Meditation.'
  return 'Thanks for sharing. I understand. If you feel unsafe, tap Crisis Alert.'
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! I\'m your HopeLine assistant. How can I help?' }
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
    setTimeout(()=>{
      setMessages(prev=>[...prev, { id: prev.length+1, from: 'bot', text: botReply(text) }])
    }, 400)
  }

  return (
    <div className={styles.root}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>HopeLine Chatbot</div>
          <div className={styles.list} ref={listRef}>
            {messages.map(m=> (
              <div key={m.id} className={`${styles.msg} ${m.from==='you'? styles.you : styles.bot}`}>{m.text}</div>
            ))}
          </div>
          <div className={styles.inputRow}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" onKeyDown={e=> e.key==='Enter' && send()} />
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


