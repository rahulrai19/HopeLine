import { useEffect, useMemo, useRef, useState } from 'react'
import { AIAPI } from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

function loadSessions(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveSessions(key, s) { localStorage.setItem(key, JSON.stringify(s)) }

export function NavbarChat() {
  const { user } = useAuth()
  const storageKey = user?.id ? `hl_chat_sessions:${user.id}` : null
  const [open, setOpen] = useState(false)
  const [sessions, setSessions] = useState(() => storageKey ? loadSessions(storageKey) : [])
  const [activeId, setActiveId] = useState(() => sessions[0]?.id || null)
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const [uiScale, setUiScale] = useState(1)
  const [suggestionOptions, setSuggestionOptions] = useState([])

  // Load sessions when user changes (logged in/out)
  useEffect(()=>{
    if (storageKey) {
      const loaded = loadSessions(storageKey)
      setSessions(loaded)
      setActiveId(loaded[0]?.id || null)
    } else {
      setSessions([])
      setActiveId(null)
    }
  }, [storageKey])

  // Persist only if logged-in
  useEffect(()=>{ if (storageKey) saveSessions(storageKey, sessions) }, [sessions, storageKey])
  useEffect(()=>{ if (!activeId && sessions[0]) setActiveId(sessions[0].id) }, [sessions, activeId])
  useEffect(()=>{ if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, [sessions, activeId])

  const activeSession = useMemo(()=> sessions.find(s=>s.id===activeId) || null, [sessions, activeId])

  function newSession() {
    const s = { id: 's_'+Date.now(), title: 'New session', createdAt: Date.now(), messages: [
      { id: 1, role: 'assistant', content: "Hi! I'm your HopeLine assistant. How can I help?" }
    ]}
    setSessions(prev=>[s, ...prev])
    setActiveId(s.id)
  }

  function renameSession(id, title){
    setSessions(prev => prev.map(s => s.id===id ? { ...s, title: title || s.title } : s))
  }

  function deleteSession(id){
    setSessions(prev => prev.filter(s => s.id !== id))
    if (activeId === id) setActiveId(null)
  }

  async function send(){
    const text = input.trim()
    if (!text || !activeSession) return
    setInput('')
    const userMsg = { id: Date.now(), role: 'user', content: text }
    setSessions(prev => prev.map(s => s.id===activeSession.id ? { ...s, messages: [...s.messages, userMsg] } : s))
    try {
      const payload = { messages: [...activeSession.messages, userMsg] }
      const ai = await AIAPI.chat(payload)
      const botMsg = { id: Date.now()+1, role: 'assistant', content: ai.reply || "I'm here to help." }
      setSessions(prev => prev.map(s => s.id===activeSession.id ? { ...s, messages: [...s.messages, botMsg] } : s))
      setSuggestionOptions(Array.isArray(ai.suggestions) ? ai.suggestions : [])
      if (!activeSession.title || activeSession.title === 'New session') {
        const snippet = text.slice(0, 30)
        renameSession(activeSession.id, snippet || 'Session')
      }
    } catch (e) {
      let reason = ''
      try { reason = JSON.parse(e.message).message } catch { reason = e?.message || '' }
      const botMsg = { id: Date.now()+1, role: 'assistant', content: reason ? `AI error: ${reason}` : "I'm having trouble reaching the AI right now. Please try again." }
      setSessions(prev => prev.map(s => s.id===activeSession.id ? { ...s, messages: [...s.messages, botMsg] } : s))
    }
  }

  return (
    <div style={{ position:'relative' }}>
      <button className="btn ghost" onClick={()=>setOpen(true)} aria-label="Open chat">💬</button>
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:1000 }}>
          <div onClick={()=>setOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} />
          <div style={{ position:'relative', width:'100vw', height:'100vh', display:'grid', gridTemplateRows:'auto 1fr', background:'var(--panel)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <strong>HopeLine Chat</strong>
                <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--muted)' }}>
                  Size
                  <input type="range" min={0.8} max={1.4} step={0.05} value={uiScale} onChange={e=>setUiScale(Number(e.target.value))} />
                </label>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'var(--muted)', fontSize:12 }}>Sessions {storageKey? '(saved)': '(not saved)'}</span>
                <button className="btn" onClick={()=>setOpen(false)} aria-label="Close">×</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', minHeight:0, transform:`scale(${uiScale})`, transformOrigin:'top left' }}>
              <div style={{ borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', minHeight:0 }}>
            <div style={{ padding:12, display:'flex', gap:8 }}>
              <button className="btn primary" onClick={newSession}>New session</button>
            </div>
            <div style={{ overflow:'auto' }}>
              {!storageKey && (
                <div style={{ padding:'0 12px 8px', color:'var(--muted)', fontSize:12 }}>Sign up to save your chat sessions.</div>
              )}
              {sessions.length === 0 && (
                <div style={{ padding:12, color:'var(--muted)' }}>No sessions yet</div>
              )}
              {sessions.map(s => (
                <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:6, padding:'8px 12px', background: s.id===activeId? 'var(--hover)': 'transparent', cursor:'pointer' }}>
                  <div onClick={()=>setActiveId(s.id)}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{s.title || 'Session'}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn ghost" onClick={()=>renameSession(s.id, prompt('Rename session', s.title) || s.title)}>✏️</button>
                    <button className="btn ghost" onClick={()=>deleteSession(s.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
              </div>
              <div style={{ display:'grid', gridTemplateRows:'1fr auto', minHeight:0 }}>
                <div ref={listRef} style={{ overflow:'auto', padding:12 }}>
              {!activeSession && <div style={{ color:'var(--muted)' }}>Create or select a session to start.</div>}
              {activeSession && activeSession.messages.map(m => (
                <div key={m.id} style={{ display:'flex', gap:8, margin:'8px 0' }}>
                  <div style={{ width:28, textAlign:'center' }}>{m.role==='user'? '🧑' : '🤖'}</div>
                  <div style={{ background: m.role==='user' ? 'var(--input-bg)' : 'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 10px', maxWidth:'100%' }}>
                    {m.content}
                  </div>
                </div>
              ))}
                </div>
                <div style={{ padding:12, borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
                  <input
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=> e.key==='Enter' && send()}
                    placeholder="Type your message..."
                    style={{ flex:1 }}
                  />
                  <button className="btn primary" onClick={send} disabled={!activeSession}>Send</button>
                </div>
                {suggestionOptions.length > 0 && (
                  <div style={{ padding:'8px 12px', borderTop:'1px solid var(--border)', display:'flex', flexWrap:'wrap', gap:8 }}>
                    {suggestionOptions.map((key) => {
                      const routeMap = {
                        self_help_tips: '/student/self-help',
                        counselor_booking: '/student/counselor',
                        peer_support: '/student/peer',
                        start_assessment: '/student/assessment',
                      }
                      const labelMap = {
                        self_help_tips: 'Self-Help Resources',
                        counselor_booking: 'Book a Counselor',
                        peer_support: 'Peer Support',
                        start_assessment: 'Start Assessment',
                        general_chat: 'Continue Chat',
                      }
                      const href = routeMap[key]
                      const label = labelMap[key] || 'Explore'
                      if (href) {
                        return (
                          <a key={key} href={href} className="btn ghost">{label}</a>
                        )
                      }
                      return (
                        <button key={key} className="btn ghost" onClick={()=>{ setInput(label); setTimeout(send, 0) }}>{label}</button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


