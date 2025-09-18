import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointmentsAPI } from '../../services/api.js'

const counselors = [
  { id: 1, name: 'Dr. A. Sharma', specialty: 'Anxiety', photo: '/avatar1.png' },
  { id: 2, name: 'Ms. R. Iyer', specialty: 'Depression', photo: '/avatar2.png' },
]

export function Counselor() {
  const [selected, setSelected] = useState(null)
  const [slot, setSlot] = useState('10:00')
  const [booked, setBooked] = useState(false)
  const [lastAppointment, setLastAppointment] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Available Counselors</h2>
        <div className="grid grid-3">
          {counselors.map(c => (
            <button key={c.id} className="card btn" onClick={()=>setSelected(c)}>
              <img src={c.photo} alt="" style={{borderRadius:12}} />
              <div>
                <h4>{c.name}</h4>
                <p className="pill">{c.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Book Appointment</h3>
        {!selected ? <p>Select a counselor above</p> : (
          <div>
            <p>With <strong>{selected.name}</strong></p>
            <label>Date</label>
            <input type="date" />
            <label>Time</label>
            <select value={slot} onChange={e=>setSlot(e.target.value)}>
              {['10:00','11:00','14:00','15:00'].map(s=> <option key={s}>{s}</option>)}
            </select>
            <button className="btn primary" style={{marginTop:10}} onClick={async ()=>{
              const token = localStorage.getItem('token')
              if (!token) { alert('Please login first'); navigate('/login?role=student'); return }
              const res = await AppointmentsAPI.book({ studentId: '000000000000000000000001', counselorId: String(selected.id).padStart(24,'0'), startsAt: new Date().toISOString() })
              setBooked(true)
              setLastAppointment(res)
              localStorage.setItem('lastAppointmentId', res._id || '')
            }}>Book</button>
            {booked && <p className="pill" style={{marginTop:8}}>Booked for {slot}. Appointment saved.</p>}
            <div className="card" style={{marginTop:12}}>
              <p>Secure video/chat session window (placeholder)</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


