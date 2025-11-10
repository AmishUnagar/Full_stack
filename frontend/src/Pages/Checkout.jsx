import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { apiRequest } from '../utils/api'
import { Button } from '../Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card'
import { Input } from '../Components/ui/input'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { cartItems, all_product, getTotalCartAmount, clearCart } = useContext(ShopContext)
  const [address, setAddress] = useState({ line1:'', line2:'', city:'', state:'', postalCode:'', country:'India' })
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [successDetails, setSuccessDetails] = useState(null)
  const navigate = useNavigate()

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

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
      document.body.appendChild(script)
    })
  }, [])

  async function handleCheckout(){
    if (items.length === 0) {
      setPaymentError('Your cart is empty.')
      return
    }

    const cartTotal = getTotalCartAmount()
    if (cartTotal <= 0) {
      setPaymentError('Cart total must be greater than zero to proceed.')
      return
    }

    setSuccessDetails(null)
    setPaymentError('')

    try{
      setLoading(true)
      await loadRazorpayScript()

      const orderPayload = await apiRequest('/payments/create-order', {
        method: 'POST',
        body: {
          amount: cartTotal,
          currency: 'INR'
        }
      })

      // If backend is in mock mode (no keys), skip Razorpay popup and complete immediately
      if (orderPayload.mock) {
        try {
          const verification = await apiRequest('/payments/verify', {
            method: 'POST',
            body: {
              razorpayOrderId: orderPayload.orderId,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              razorpaySignature: 'mock_signature',
              amount: orderPayload.amount,
              items,
              subtotal: cartTotal,
              total: cartTotal,
              shippingAddress: address
            }
          })
          try{ localStorage.setItem('lastOrderId', verification.orderId) }catch{}
          clearCart()
          setSuccessDetails({
            orderId: verification.orderId,
            invoicePath: verification.invoicePath || '/invoice'
          })
          try {
            window.open(verification.invoicePath || '/invoice', '_blank', 'noopener')
          } catch {}
        } catch (verifyErr) {
          setPaymentError(verifyErr.message || 'Mock payment verification failed.')
        } finally {
          setLoading(false)
        }
        return
      }

      const options = {
        key: orderPayload.razorpayKeyId,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        name: 'Jewelry Store (Test)',
        description: 'Test transaction via Razorpay',
        image: '/vite.svg',
        order_id: orderPayload.orderId,
        handler: async (response) => {
          try {
            setLoading(true)
            const verification = await apiRequest('/payments/verify', {
              method: 'POST',
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: orderPayload.amount,
                items,
                subtotal: cartTotal,
                total: cartTotal,
                shippingAddress: address
              }
            })

            try{ localStorage.setItem('lastOrderId', verification.orderId) }catch{}
            clearCart()

            setSuccessDetails({
              orderId: verification.orderId,
              invoicePath: verification.invoicePath || '/invoice'
            })

            try {
              window.open(verification.invoicePath || '/invoice', '_blank', 'noopener')
            } catch (err) {
              console.warn('Invoice auto-open blocked by browser:', err)
            }
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr)
            setPaymentError(verifyErr.message || 'Payment verification failed. Please contact support.')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        notes: {
          address: `${address.line1 || ''} ${address.line2 || ''} ${address.city || ''}`.trim()
        },
        theme: {
          color: '#3399cc'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Payment failed or cancelled.')
        setLoading(false)
      })
      paymentObject.open()
    }catch(e){
      console.error('Checkout error:', e)
      setPaymentError(e.message || 'Unable to initialize payment. Please try again.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="oh-shipping-card">
  <CardHeader className="oh-shipping-header">
    <CardTitle>Shipping Address</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 oh-shipping-content">
    <Input 
      className="oh-shipping-input" 
      placeholder="Address line 1" 
      value={address.line1} 
      onChange={(e)=>setAddress(a=>({...a,line1:e.target.value}))} 
    />
    <Input 
      className="oh-shipping-input" 
      placeholder="Address line 2" 
      value={address.line2} 
      onChange={(e)=>setAddress(a=>({...a,line2:e.target.value}))} 
    />
    <div className="grid grid-cols-2 gap-3 oh-shipping-grid">
      <Input 
        className="oh-shipping-input" 
        placeholder="City" 
        value={address.city} 
        onChange={(e)=>setAddress(a=>({...a,city:e.target.value}))} 
      />
      <Input 
        className="oh-shipping-input" 
        placeholder="State" 
        value={address.state} 
        onChange={(e)=>setAddress(a=>({...a,state:e.target.value}))} 
      />
    </div>
    <div className="grid grid-cols-2 gap-3 oh-shipping-grid">
      <Input 
        className="oh-shipping-input" 
        placeholder="Postal Code" 
        value={address.postalCode} 
        onChange={(e)=>setAddress(a=>({...a,postalCode:e.target.value}))} 
      />
      <Input 
        className="oh-shipping-input" 
        placeholder="Country" 
        value={address.country} 
        onChange={(e)=>setAddress(a=>({...a,country:e.target.value}))} 
      />
    </div>
  </CardContent>
</Card>


      <Card className="oh-order-summary-card">
  <CardHeader className="oh-order-summary-header">
    <CardTitle>Order Summary</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 oh-order-summary-content">
    {items.map((it, idx) => (
      <div key={idx} className="flex items-center gap-3 oh-order-summary-item">
        <img 
          src={it.image} 
          alt="" 
          className="h-12 w-12 rounded object-cover oh-order-summary-item-image" 
        />
        <div className="flex-1 oh-order-summary-item-details">
          <p className="font-medium oh-order-summary-item-title">{it.title}</p>
          <p className="text-sm text-gray-500 oh-order-summary-item-qty">Qty: {it.quantity}</p>
        </div>
        <div className="text-right oh-order-summary-item-price">
          ₹{Number(it.price) * Number(it.quantity)}
        </div>
      </div>
    ))}
    <div className="border-t pt-4 flex justify-between oh-order-summary-total">
      <p className="font-semibold oh-order-summary-total-label">Total</p>
      <p className="font-semibold oh-order-summary-total-amount">₹{getTotalCartAmount()}</p>
    </div>
    <Button 
      onClick={handleCheckout} 
      disabled={loading || items.length === 0} 
      className="oh-order-summary-place-btn"
    >
      {loading ? 'Processing…' : 'Checkout'}
    </Button>
    {paymentError && (
      <p className="text-sm text-red-600 oh-payment-error">{paymentError}</p>
    )}
    {successDetails && (
      <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50 oh-payment-success">
        <p className="text-green-700 font-semibold">Payment successful! Your invoice is ready.</p>
        <p className="text-sm text-green-700 mt-2">Order ID: {String(successDetails.orderId).slice(-8)}</p>
        <div className="mt-3 flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(successDetails.invoicePath || '/invoice')}
            className="oh-view-invoice-btn"
          >
            View Invoice
          </Button>
          <Button 
            variant="ghost"
            onClick={() => window.open(successDetails.invoicePath || '/invoice', '_blank', 'noopener')}
            className="oh-download-invoice-btn"
          >
            Open in New Tab
          </Button>
        </div>
      </div>
    )}
  </CardContent>
</Card>

    </div>
  )
}

export default Checkout


