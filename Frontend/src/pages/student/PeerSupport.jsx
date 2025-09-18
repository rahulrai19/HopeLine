import { useState } from 'react'

export function PeerSupport() {
  const [messages, setMessages] = useState([{ id: 1, from: 'Peer', text: 'Welcome! Share how you feel today.' }])
  const [input, setInput] = useState('')
  function send() {
    if (!input.trim()) return
    setMessages(prev=>[...prev, { id: prev.length+1, from: 'You', text: input }])
    setInput('')
  }
  return (
    <div className="card">
      <h2>Peer Support</h2>
      <div style={{height:300, overflow:'auto', padding:12, background:'#0d1730', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)'}}>
        {messages.map(m=> (
          <div key={m.id} style={{marginBottom:8}}>
            <strong>{m.from}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:8, marginTop:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" />
        <button className="btn primary" onClick={send}>Send</button>
      </div>
      <p className="pill" style={{marginTop:8}}>Anonymous mode enabled (placeholder)</p>
    </div>
  )
}


