import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { API_BASE } from '../../config.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { AppointmentsAPI } from '../../services/api.js'
import styles from './Counselor.module.scss'

const counselors = [
  { id: 1, name: 'Dr. Ananya Sharma', specialty: 'Anxiety & Stress', available: true, photo: null, sessions: 120, rating: 4.9 },
  { id: 2, name: 'Ms. Ritu Iyer', specialty: 'Depression & Grief', available: true, photo: null, sessions: 95, rating: 4.8 },
  { id: 3, name: 'Dr. Karan Mehta', specialty: 'Trauma & PTSD', available: false, photo: null, sessions: 200, rating: 4.7 },
]

function ChatWindow({ counselor }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const roomId = `chat_${user?.id || 'demo'}_counselor`

  useEffect(() => {
    fetch(`${API_BASE}/api/chat/${roomId}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMessages(d) })
      .catch(console.error)

    const token = localStorage.getItem('token') || ''
    const socket = io(API_BASE, { auth: { token } })
    socketRef.current = socket
    socket.on('connect', () => socket.emit('join_room', roomId))
    socket.on('receive_message', msg => setMessages(p => [...p, msg]))
    return () => socket.disconnect()
  }, [roomId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function send() {
    if (!input.trim() || !socketRef.current) return
    socketRef.current.emit('send_message', { roomId, text: input, senderName: user?.name || 'Student' })
    setInput('')
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.chatAvatar}>{counselor.name.charAt(0)}</div>
        <div>
          <div className={styles.chatName}>{counselor.name}</div>
          <div className={styles.chatSpec}>{counselor.specialty}</div>
        </div>
        <span className={styles.liveBadge}>● Live</span>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyMsg}>
            Your session with {counselor.name} has started. Say hello! 👋
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.senderId === user?.id
          return (
            <div key={m._id || i} className={`${styles.msg} ${isMe ? styles.msgMe : styles.msgThem}`}>
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
          placeholder="Type a message..."
        />
        <button className={styles.sendBtn} onClick={send} disabled={!input.trim()}>➤</button>
      </div>
    </div>
  )
}

export function Counselor() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [slot, setSlot] = useState('10:00')
  const [date, setDate] = useState('')
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)

  async function book() {
    if (!selected || !date) return
    setLoading(true)
    try {
      await AppointmentsAPI.book({
        studentId: user?.id || '000000000000000000000001',
        counselorId: String(selected.id).padStart(24, '0'),
        startsAt: new Date(`${date}T${slot}`).toISOString()
      })
      setBooked(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {!booked ? (
        <>
          <h2 className={styles.pageTitle}>Book a Counselor Session</h2>
          <p className={styles.pageDesc}>Choose a licensed mental health professional and schedule your private session.</p>

          <div className={styles.counselorGrid}>
            {counselors.map(c => (
              <button
                key={c.id}
                className={`${styles.counselorCard} ${selected?.id === c.id ? styles.selected : ''} ${!c.available ? styles.unavailable : ''}`}
                onClick={() => c.available && setSelected(c)}
                disabled={!c.available}
              >
                <div className={styles.avatar}>{c.name.charAt(0)}</div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{c.name}</div>
                  <div className={styles.cardSpec}>{c.specialty}</div>
                  <div className={styles.cardStats}>
                    <span>⭐ {c.rating}</span>
                    <span>·</span>
                    <span>{c.sessions}+ sessions</span>
                  </div>
                </div>
                <div className={`${styles.availDot} ${c.available ? styles.availOnline : styles.availOff}`} />
              </button>
            ))}
          </div>

          {selected && (
            <div className={styles.bookingForm}>
              <h4>Book with {selected.name}</h4>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <select value={slot} onChange={e => setSlot(e.target.value)}>
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="btn primary lg" onClick={book} disabled={loading || !date}>
                {loading ? <span className="spinner" /> : '📅 Confirm Booking'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className={styles.bookedBanner}>
            <span>✅</span>
            <div>
              <strong>Session Booked!</strong>
              <p>Your session with {selected.name} on {date} at {slot} is confirmed.</p>
            </div>
            <button className="btn ghost sm" onClick={() => setBooked(false)}>Change</button>
          </div>
          <ChatWindow counselor={selected} />
        </>
      )}
    </div>
  )
}
