import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { apiRequest } from '../utils/api'
import { Button } from '../Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card'
import { Input } from '../Components/ui/input'

const Checkout = () => {
  const { cartItems, all_product, getTotalCartAmount, clearCart } = useContext(ShopContext)
  const [address, setAddress] = useState({ line1:'', line2:'', city:'', state:'', postalCode:'', country:'India' })
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      window.location.href = '/login'
    }
  },[])

  const items = useMemo(()=> all_product.filter(p=>cartItems[p.id]>0).map(p=>({
    product: String(p.id), // Convert to string to avoid casting issues
    title: p.name,
    image: p.image,
    price: p.new_price,
    quantity: cartItems[p.id],
  })), [cartItems, all_product])

  async function placeOrder(){
    try{
      setLoading(true)
      const { order } = await apiRequest('/orders', { 
        method:'POST', 
        body:{ 
          items, 
          total: getTotalCartAmount(),
          shippingAddress: address 
        } 
      })
      try{ localStorage.setItem('lastOrderId', order._id) }catch{}
      clearCart()
      window.location.href = '/invoice'
    }catch(e){
      alert(e.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Address line 1" value={address.line1} onChange={(e)=>setAddress(a=>({...a,line1:e.target.value}))} />
          <Input placeholder="Address line 2" value={address.line2} onChange={(e)=>setAddress(a=>({...a,line2:e.target.value}))} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="City" value={address.city} onChange={(e)=>setAddress(a=>({...a,city:e.target.value}))} />
            <Input placeholder="State" value={address.state} onChange={(e)=>setAddress(a=>({...a,state:e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Postal Code" value={address.postalCode} onChange={(e)=>setAddress(a=>({...a,postalCode:e.target.value}))} />
            <Input placeholder="Country" value={address.country} onChange={(e)=>setAddress(a=>({...a,country:e.target.value}))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.map((it,idx)=> (
            <div key={idx} className="flex items-center gap-3">
              <img src={it.image} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium">{it.title}</p>
                <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
              </div>
              <div className="text-right">₹{Number(it.price)*Number(it.quantity)}</div>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">₹{getTotalCartAmount()}</p>
          </div>
          <Button onClick={placeOrder} disabled={loading || items.length===0}>{loading ? 'Placing…' : 'Place Order'}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Checkout


