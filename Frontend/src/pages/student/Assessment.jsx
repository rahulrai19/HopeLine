import { useEffect, useMemo, useState } from 'react'

const phqQuestions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly or being fidgety/restless',
  'Thoughts that you would be better off dead or of hurting yourself'
]

const gadQuestions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
]

export function Assessment() {
  // Randomize mode: 'phq', 'gad', or 'both'
  const [mode, setMode] = useState('both')
  useEffect(()=>{
    const options = ['phq','gad','both']
    setMode(options[Math.floor(Math.random()*options.length)])
  }, [])

  const [phq, setPhq] = useState(Array(phqQuestions.length).fill(0))
  const [gad, setGad] = useState(Array(gadQuestions.length).fill(0))
  const [submitted, setSubmitted] = useState(false)

  // Build a question queue. If mode is 'both', mix PHQ and GAD and shuffle order.
  const queue = useMemo(()=>{
    const phqQ = phqQuestions.map((q,i)=>({ type:'phq', text:q, idx:i }))
    const gadQ = gadQuestions.map((q,i)=>({ type:'gad', text:q, idx:i }))
    if (mode==='phq') return phqQ
    if (mode==='gad') return gadQ
    const merged = [...phqQ, ...gadQ]
    // Shuffle
    for (let i=merged.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [merged[i],merged[j]]=[merged[j],merged[i]] }
    return merged
  }, [mode])

  const [cursor, setCursor] = useState(0)
  const current = queue[cursor] || { type:'phq', text:'', idx:0 }

  const totalQuestions = queue.length
  const answeredCount = useMemo(()=>{
    const a = phq.filter(v=>v!==undefined).length
    const b = gad.filter(v=>v!==undefined).length
    if (mode==='phq') return a
    if (mode==='gad') return b
    return a+b
  }, [mode, phq, gad])

  const scorePhq = phq.reduce((a,b)=>a+b,0)
  const scoreGad = gad.reduce((a,b)=>a+b,0)

  const modeLabel = useMemo(()=>{
    if (mode==='both') return 'PHQ-9 + GAD-7'
    return mode==='phq' ? 'PHQ-9' : 'GAD-7'
  }, [mode])

  function setAnswer(value){
    if (current.type==='phq') { setPhq(prev=>{ const n=[...prev]; n[current.idx]=value; return n }) }
    else { setGad(prev=>{ const n=[...prev]; n[current.idx]=value; return n }) }
  }

  function next(){ if (cursor < queue.length-1) setCursor(i=>i+1) }
  function prev(){ if (cursor>0) setCursor(i=>i-1) }

  const selectedValue = current.type==='phq' ? phq[current.idx] : gad[current.idx]
  const overall = scorePhq + scoreGad
  const riskHigh = overall >= 20

  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Assessment</h2>
        <p>
          Randomized mode: <strong className="pill">{modeLabel}</strong>. Rate 0 (Not at all) → 3 (Nearly every day).
        </p>
        <div style={{height:10, background:'var(--input-bg)', border:'1px solid var(--border)', borderRadius:999}}>
          <div style={{height:'100%', width:`${Math.round((answeredCount/totalQuestions)*100)}%`, background:'linear-gradient(135deg, var(--primary-600), var(--primary))', borderRadius:999}} />
        </div>
      </section>

      {/* Interactive stepper */}
      <section className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>{current.type === 'phq' ? 'PHQ-9' : 'GAD-7'}</h3>
          <span className="pill">Question {cursor+1} / {totalQuestions}</span>
        </div>
        <div style={{marginTop:12, fontSize:18}}>{current.text}</div>
        <div style={{marginTop:16}}>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={selectedValue}
            onChange={(e)=>setAnswer(Number(e.target.value))}
            style={{width:'100%'}}
          />
          <div style={{display:'flex', justifyContent:'space-between', color:'var(--muted)', fontSize:12, marginTop:6}}>
            <span>0 · Not at all</span>
            <span>1</span>
            <span>2</span>
            <span>3 · Nearly every day</span>
          </div>
          <div style={{marginTop:6}}>Selected: <strong>{selectedValue}</strong></div>
        </div>
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button className="btn" onClick={prev} disabled={cursor===0}>Back</button>
          <button className="btn" onClick={next} disabled={cursor===queue.length-1}>Next</button>
        </div>
      </section>

      {mode!=='gad' && (
        <section className="card">
          <h3>PHQ-9 Summary</h3>
          <p>Total: {scorePhq}</p>
        </section>
      )}
      {mode!=='phq' && (
        <section className="card">
          <h3>GAD-7 Summary</h3>
          <p>Total: {scoreGad}</p>
        </section>
      )}

      <section className="card">
        {!submitted ? (
          <button className="btn primary" onClick={()=>setSubmitted(true)}>Submit</button>
        ) : (
          <div>
            <p>Submitted! Your provisional risk is {riskHigh ? <strong className="risk-high">High</strong> : <strong className="risk-low">Low</strong>}.</p>
            {riskHigh && <a className="btn danger" href="/student/crisis">Open Crisis Alert</a>}
          </div>
        )}
      </section>
    </div>
  )
}


