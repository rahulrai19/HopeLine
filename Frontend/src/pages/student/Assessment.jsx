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
  const [section, setSection] = useState('phq')
  const [index, setIndex] = useState(0)

  const activeQuestions = useMemo(()=> section==='phq' ? phqQuestions : gadQuestions, [section])
  const totalQuestions = useMemo(()=> {
    if (mode==='both') return phqQuestions.length + gadQuestions.length
    if (mode==='phq') return phqQuestions.length
    return gadQuestions.length
  }, [mode])
  const answeredCount = useMemo(()=> {
    if (mode==='both') return phq.filter(v=>v!==undefined).length + gad.filter(v=>v!==undefined).length
    if (mode==='phq') return phq.filter(v=>v!==undefined).length
    return gad.filter(v=>v!==undefined).length
  }, [mode, phq, gad])

  const scorePhq = phq.reduce((a,b)=>a+b,0)
  const scoreGad = gad.reduce((a,b)=>a+b,0)

  function setAnswer(value){
    if (section==='phq') { setPhq(prev=>{ const n=[...prev]; n[index]=value; return n }) }
    else { setGad(prev=>{ const n=[...prev]; n[index]=value; return n }) }
  }

  function next(){
    if (index < activeQuestions.length-1) setIndex(i=>i+1)
    else if (mode==='both' && section==='phq') { setSection('gad'); setIndex(0) }
  }
  function prev(){ if (index>0) setIndex(i=>i-1) }

  const overall = scorePhq + scoreGad
  const riskHigh = overall >= 20

  return (
    <div className="grid" style={{gap:24}}>
      <section className="card">
        <h2>Assessment</h2>
        <p>Randomized mode: <strong className="pill">{mode.toUpperCase()}</strong>. Rate 0 (Not at all) → 3 (Nearly every day).</p>
        <div style={{height:10, background:'#142144', borderRadius:999}}>
          <div style={{height:'100%', width:`${Math.round((answeredCount/totalQuestions)*100)}%`, background:'linear-gradient(135deg, #49c099, #6edfb8)', borderRadius:999}} />
        </div>
      </section>

      {/* Interactive stepper */}
      <section className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>{section === 'phq' ? 'PHQ-9' : 'GAD-7'}</h3>
          <span className="pill">Question {index+1} / {activeQuestions.length}</span>
        </div>
        <div style={{marginTop:12, fontSize:18}}>{activeQuestions[index]}</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:8, marginTop:12}}>
          {[0,1,2,3].map(v=> (
            <button key={v} className={`btn ${((section==='phq'? phq[index] : gad[index])===v)? 'primary' : ''}`} onClick={()=>setAnswer(v)}>{v}</button>
          ))}
        </div>
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button className="btn" onClick={prev} disabled={index===0}>Back</button>
          <button className="btn" onClick={next} disabled={index===activeQuestions.length-1 && !(mode==='both' && section==='phq')}>Next</button>
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


