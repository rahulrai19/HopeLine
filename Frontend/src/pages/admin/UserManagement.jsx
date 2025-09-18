const users = [
  { id: 1, name: 'Aarav', email: 'aarav@uni.edu', status: 'active' },
  { id: 2, name: 'Dia', email: 'dia@uni.edu', status: 'active' },
  { id: 3, name: 'Kabir', email: 'kabir@uni.edu', status: 'suspended' },
]

export function UserManagement() {
  return (
    <div className="card">
      <h2>User Management</h2>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Status</th>
              <th align="left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u=> (
              <tr key={u.id} style={{borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="pill">{u.status}</span></td>
                <td>
                  <button className="btn">View</button>
                  <button className="btn ghost" style={{marginLeft:6}}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


