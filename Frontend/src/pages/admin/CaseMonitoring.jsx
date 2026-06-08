import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { API_BASE } from '../../config.js'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './CaseMonitoring.module.scss'

const CASES = [
  { id: 'demo', student: 'Student Demo', risk: 'High', score: 22 },
  { id: 'student_123', student: 'Priya Sharma', risk: 'Medium', score: 13 },
  { id: 'student_456', student: 'Rohan Verma', risk: 'Low', score: 6 },
]

export function CaseMonitoring() {
  const { user } = useAuth()
  const [activeCase, setActiveCase] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!activeCase) return
    const roomId = `chat_${activeCase.id}_counselor`
    setMessages([])

    fetch(`${API_BASE}/api/chat/${roomId}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMessages(d) })
      .catch(console.error)

    if (socketRef.current) socketRef.current.disconnect()
    const token = localStorage.getItem('token') || ''
    const socket = io(API_BASE, { auth: { token } })
    socketRef.current = socket
    socket.on('connect', () => socket.emit('join_room', roomId))
    socket.on('receive_message', msg => setMessages(p => [...p, msg]))
    return () => socket.disconnect()
  }, [activeCase])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function send() {
    if (!input.trim() || !socketRef.current || !activeCase) return
    const roomId = `chat_${activeCase.id}_counselor`
    socketRef.current.emit('send_message', { roomId, text: input, senderName: user?.name || 'Counselor' })
    setInput('')
  }

  return (
    <div className={styles.page}>
      {/* Case List */}
      <aside className={styles.caseList}>
        <div className={styles.caseListHeader}>
          <h3>Active Cases</h3>
          <span className="badge primary">{CASES.length}</span>
        </div>
        {CASES.map(c => (
          <button
            key={c.id}
            className={`${styles.caseItem} ${activeCase?.id === c.id ? styles.caseActive : ''}`}
            onClick={() => setActiveCase(c)}
          >
            <div className={styles.caseAvatar}>{c.student.charAt(0)}</div>
            <div className={styles.caseInfo}>
              <div className={styles.caseName}>{c.student}</div>
              <div className={`${styles.caseRisk} ${c.risk === 'High' ? styles.riskHigh : c.risk === 'Medium' ? styles.riskMed : styles.riskLow}`}>
                {c.risk} Risk · Score {c.score}
              </div>
            </div>
            {activeCase?.id === c.id && <span className={styles.activeDot} />}
          </button>
        ))}
      </aside>

      {/* Chat Panel */}
      <div className={styles.chatPanel}>
        {!activeCase ? (
          <div className={styles.empty}>
            <span>💬</span>
            <h4>Select a case to open the counseling session</h4>
            <p>Click on a student case from the left panel to begin chatting.</p>
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatAvatar}>{activeCase.student.charAt(0)}</div>
              <div>
                <div className={styles.chatName}>{activeCase.student}</div>
                <div className={`${styles.caseRisk} ${activeCase.risk === 'High' ? styles.riskHigh : activeCase.risk === 'Medium' ? styles.riskMed : styles.riskLow}`}>
                  {activeCase.risk} Risk
                </div>
              </div>
              <span className={styles.liveBadge}>● Live Session</span>
            </div>

            <div className={styles.messages}>
              {messages.length === 0 && (
                <div className={styles.emptyMsg}>Session started. Say hello to {activeCase.student} 👋</div>
              )}
              {messages.map((m, i) => {
                const isCounselor = m.senderId === user?.id || m.senderRole === 'admin'
                return (
                  <div key={m._id || i} className={`${styles.msg} ${isCounselor ? styles.msgMe : styles.msgThem}`}>
                    <div className={styles.msgBubble}>{m.text}</div>
                    <div className={styles.msgMeta}>{m.senderName} · {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className={styles.inputRow}>
              <input
                className={styles.chatInput}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={`Reply to ${activeCase.student}...`}
              />
              <button className={styles.sendBtn} onClick={send} disabled={!input.trim()}>➤</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
