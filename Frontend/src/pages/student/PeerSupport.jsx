import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { API_BASE } from '../../config.js'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './PeerSupport.module.scss'

export function PeerSupport() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(1)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const roomId = 'peer-support-community'

  useEffect(() => {
    // Fetch history
    fetch(`${API_BASE}/api/chat/${roomId}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMessages(d) })
      .catch(console.error)

    const token = localStorage.getItem('token') || ''
    const socket = io(API_BASE, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join_room', roomId)
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('receive_message', msg => setMessages(p => [...p, msg]))

    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    if (!input.trim() || !socketRef.current) return
    socketRef.current.emit('send_message', {
      roomId,
      text: input,
      senderName: user?.name || 'Anonymous'
    })
    setInput('')
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.roomInfo}>
          <div className={styles.roomIcon}>💬</div>
          <h3 className={styles.roomName}>Community Chat</h3>
          <p className={styles.roomDesc}>A safe space to share and connect with fellow students anonymously.</p>
        </div>
        <div className={styles.statusRow}>
          <span className={`${styles.dot} ${connected ? styles.online : styles.offline}`} />
          <span className={styles.statusText}>{connected ? 'Connected' : 'Connecting...'}</span>
        </div>
        <div className={styles.rules}>
          <h5>Community Guidelines</h5>
          <ul>
            <li>Be kind and empathetic</li>
            <li>No personal identifying info</li>
            <li>Support, don't judge</li>
            <li>Report harmful content</li>
          </ul>
        </div>
      </aside>

      {/* Chat area */}
      <div className={styles.chatArea}>
        {/* Top bar */}
        <div className={styles.chatHeader}>
          <div className={styles.chatTitle}>
            <span>🌐</span> Peer Support Community
          </div>
          <div className={styles.chatMeta}>
            <span className={`${styles.dot} ${connected ? styles.online : styles.offline}`} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{connected ? 'Live' : 'Connecting'}</span>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <span>💬</span>
              <p>Be the first to say something. This is a safe space.</p>
            </div>
          )}
          {messages.map((m, i) => {
            const isMe = m.senderId === user?.id
            const initials = (m.senderName || 'U').charAt(0).toUpperCase()
            return (
              <div key={m._id || i} className={`${styles.message} ${isMe ? styles.mine : styles.theirs}`}>
                {!isMe && (
                  <div className={styles.avatar}>{initials}</div>
                )}
                <div className={styles.bubble}>
                  {!isMe && <div className={styles.senderName}>{m.senderName || 'Peer'}</div>}
                  <div className={styles.bubbleText}>{m.text}</div>
                  <div className={styles.time}>
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
                {isMe && <div className={`${styles.avatar} ${styles.myAvatar}`}>{initials}</div>}
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputBar}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Share something with the community..."
            className={styles.input}
          />
          <button className={styles.sendBtn} onClick={send} disabled={!input.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
