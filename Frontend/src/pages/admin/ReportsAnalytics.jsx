import { useMemo, useState } from 'react'
import styles from './ReportsAnalytics.module.scss'
import { AdminCharts } from './AdminCharts.jsx'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export function ReportsAnalytics() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const sentimentData = useMemo(() => ({
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment',
        data: [55, 30, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(107, 114, 128, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 0
      }
    ]
  }), [])
  return (
    <div className={styles.root}>
      <header className={styles.headerRow}>
        <h2 className={styles.title}>Reports & Analytics</h2>
        <div className={styles.filterGrid}>
          <div>
            <label>From</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div>
            <label>To</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <button className="btn primary">Generate</button>
        </div>
      </header>

      <section className={styles.kpisRow}>
        <div className={`${styles.kpiCard} card`}>
          <div className={styles.kpiLabel}>Total Visits</div>
          <div className={styles.kpiValue}>32,211</div>
          <div className={styles.kpiDelta} data-positive>+10%</div>
        </div>
        <div className={`${styles.kpiCard} card`}>
          <div className={styles.kpiLabel}>Page Views</div>
          <div className={styles.kpiValue}>351</div>
        </div>
        <div className={`${styles.kpiCard} card`}>
          <div className={styles.kpiLabel}>Shares</div>
          <div className={styles.kpiValue}>122</div>
          <div className={styles.kpiDelta} data-positive>+5%</div>
        </div>
        <div className={`${styles.kpiCard} card`}>
          <div className={styles.kpiLabel}>Avg. Session</div>
          <div className={styles.kpiValue}>4m 12s</div>
        </div>
      </section>

      <section className="card">
        <div className={styles.gridTop}>
          <div className="card">
            <h4>Usage</h4>
            <div className={styles.cardContent}><AdminCharts /></div>
          </div>
          <div className="card">
            <h4>Sentiment</h4>
            <div className={styles.cardContent}><Doughnut data={sentimentData} /></div>
          </div>
          <div className="card">
            <h4>Risk Trends</h4>
            <div className={styles.cardContent}><AdminCharts /></div>
          </div>
        </div>
      </section>
    </div>
  )
}


