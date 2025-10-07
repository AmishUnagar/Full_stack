import React, { useEffect, useState } from 'react'
import { apiRequest } from '../utils/api'

const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){ window.location.href = '/login'; return }
    async function load(){
      try{
        setLoading(true); setError('')
        const { orders } = await apiRequest('/orders')
        setOrders(orders)
      }catch(e){ setError(e.message) }
      finally{ setLoading(false) }
    }
    load()
  },[])

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <h1>My Orders</h1>
      <hr/>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color:'#ec1c24' }}>{error}</p>}
      <div>
        {orders.map(o => (
          <div key={o._id} style={{ padding:'12px 0', borderBottom:'1px solid #eee', display:'grid', gap:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <strong>Order</strong> #{o._id}
              </div>
              <div style={{ color:'#666' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display:'grid', gap:8 }}>
              {o.items.map((it, idx)=> (
                <div key={idx} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {it.image && <img src={it.image} alt="" style={{ width:44, height:44, borderRadius:6, objectFit:'cover' }} />}
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500 }}>{it.title}</div>
                    <div style={{ color:'#666', fontSize:12 }}>Qty: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight:600 }}>₹{Number(it.price)*Number(it.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>Status: <span style={{ textTransform:'capitalize' }}>{o.status}</span></div>
              <div><strong>Total:</strong> ₹{o.total}</div>
            </div>
          </div>
        ))}
        {!loading && !orders.length && <p>No orders yet.</p>}
      </div>
    </div>
  )
}

export default Orders


