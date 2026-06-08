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
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) { listRef.current.scrollTop = listRef.current.scrollHeight }
  }, [messages, isTyping, open])

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: prev.length + 1, from: 'you', text }])
    setInput('')
    setIsTyping(true)
    
    setTimeout(async () => {
      const detected = detectLanguage(text) || lang
      try {
        const ai = await AIAPI.chat({ messages: [{ role: 'user', content: text }], lang: detected })
        setLang(detected)
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: ai.reply }])
      } catch {
        const fallback = replyFor(text, detected)
        setLang(detected)
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: fallback }])
      } finally {
        setIsTyping(false)
      }
    }, 400)
  }

  return (
    <div className={styles.root}>
      {!open && (
        <div className={styles.nudge} onClick={() => setOpen(true)}>
          <div className={styles.nudgeAvatar}>🤖</div>
          <div className={styles.nudgeText}>{BOT_MESSAGES[lang].nudge}</div>
          <span className={styles.nudgeClose} onClick={(e) => { e.stopPropagation(); setOpen(false); /* Ideally hide permanently */ }}>✕</span>
        </div>
      )}
      
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.botAvatar}>🤖</div>
              <div>
                <div className={styles.botName}>HopeLine AI</div>
                <div className={styles.botStatus}>● Online</div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <select 
                value={lang} 
                onChange={e => { 
                  setLang(e.target.value)
                  setMessages([{ id: 1, from: 'bot', text: BOT_MESSAGES[e.target.value].hello }]) 
                }} 
                className={styles.langSelect}
              >
                <option value="en">ENG</option>
                <option value="hi">HIN</option>
              </select>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className={styles.list} ref={listRef}>
            {messages.map(m => (
              <div key={m.id} className={`${styles.msgRow} ${m.from === 'you' ? styles.rowYou : styles.rowBot}`}>
                {m.from === 'bot' && <div className={styles.msgAvatar}>🤖</div>}
                <div className={`${styles.msg} ${m.from === 'you' ? styles.you : styles.bot}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.msgRow} ${styles.rowBot}`}>
                <div className={styles.msgAvatar}>🤖</div>
                <div className={`${styles.msg} ${styles.bot} ${styles.typing}`}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputRow}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={BOT_MESSAGES[lang].placeholder} 
              onKeyDown={e => e.key === 'Enter' && send()} 
              className={styles.input}
            />
            <button className={styles.sendBtn} onClick={send} disabled={!input.trim() || isTyping}>
              ➤
            </button>
          </div>
        </div>
      )}
      
      <button className={`${styles.fab} ${open ? styles.fabOpen : ''}`} onClick={() => setOpen(v => !v)} aria-label="Chatbot">
        {open ? '↓' : '💬'}
      </button>
    </div>
  )
}
