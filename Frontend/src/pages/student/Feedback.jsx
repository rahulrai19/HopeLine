import { useState } from 'react'
import { FeedbackAPI } from '../../services/api.js'

export function Feedback() {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div className="card">
      <h2>Feedback</h2>
      <p>Rate your experience</p>
      <div style={{display:'flex', gap:8}}>
        {[1,2,3,4,5].map(i=> (
          <button key={i} className={`btn ${rating>=i? 'primary':''}`} onClick={()=>setRating(i)}>
            {i}★
          </button>
        ))}
      </div>
      <label style={{marginTop:12}}>Comments</label>
      <textarea rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Share anything that can help us improve" />
      <button className="btn primary" style={{marginTop:10}} onClick={async ()=>{
        const appointmentId = localStorage.getItem('lastAppointmentId')
        try {
          await FeedbackAPI.submit({
            studentId: '000000000000000000000001',
            counselorId: '000000000000000000000002',
            appointmentId,
            rating,
            comment: text,
          })
          setSent(true)
        } catch (e) { alert('Failed to send feedback (mock IDs). Ensure API running.') }
      }}>Submit</button>
      {sent && <p className="pill" style={{marginTop:8}}>Thanks for your feedback!</p>}
    </div>
  )
}


