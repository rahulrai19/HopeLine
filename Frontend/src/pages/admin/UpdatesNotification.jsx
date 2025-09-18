import { useState } from 'react'

export function UpdatesNotification() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  function send(){ if(!title || !message) return; setSent(true) }
  return (
    <div className="card">
      <h2>Updates & Notifications</h2>
      <label>Title</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Maintenance notice" />
      <label>Message</label>
      <textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Details of the announcement" />
      <div style={{display:'flex', gap:10, marginTop:10}}>
        <button className="btn primary" onClick={send}>Send Announcement</button>
        <button className="btn ghost">Targeted (placeholder)</button>
      </div>
      {sent && <p className="pill" style={{marginTop:10}}>Announcement sent (mock)</p>}
    </div>
  )
}


