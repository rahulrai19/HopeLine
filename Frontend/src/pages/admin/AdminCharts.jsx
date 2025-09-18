import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
)

export function AdminCharts(){
  const barData = useMemo(() => ({
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [12, 19, 7, 11, 15, 9, 13],
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
      }
    ]
  }), [])

  const lineData = useMemo(() => ({
    labels: ['Week 1','Week 2','Week 3','Week 4'],
    datasets: [
      {
        label: 'Cases Opened',
        data: [22, 28, 18, 31],
        tension: 0.35,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        pointRadius: 3
      }
    ]
  }), [])

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }), [])

  return (
    <div style={{display:'flex', flexDirection:'row', gap: 16, height: '100%'}}>
      <div style={{flex: '1 1 50%', background:'#fff', borderRadius:8, padding:12, display:'flex', flexDirection:'column'}}>
        <h4 style={{marginBottom:8, textAlign:'center', fontSize:'14px', fontWeight:'600', color:'#15803d', textTransform:'uppercase', letterSpacing:'0.5px'}}>Weekly New Users</h4>
        <div style={{flex: 1, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Bar data={barData} options={options} />
        </div>
      </div>
      <div style={{flex: '1 1 50%', background:'#fff', borderRadius:8, padding:12, display:'flex', flexDirection:'column'}}>
        <h4 style={{marginBottom:8, textAlign:'center', fontSize:'14px', fontWeight:'600', color:'#15803d', textTransform:'uppercase', letterSpacing:'0.5px'}}>Monthly Case Trend</h4>
        <div style={{flex: 1, display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Line data={lineData} options={options} />
        </div>
      </div>
    </div>
  )
}


