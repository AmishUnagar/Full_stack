import React, { useState } from 'react'
import "../CSS/LoginSignup.css"
import { apiRequest } from '../utils/api'
const LoginSignup = () => {
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function onChange(e){
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(){
    try{
      setLoading(true); setError('')
      
      // Basic validation
      if(mode === 'signup' && !form.name.trim()) {
        setError('Name is required')
        return
      }
      if(!form.email.trim()) {
        setError('Email is required')
        return
      }
      if(!form.password.trim()) {
        setError('Password is required')
        return
      }
      if(form.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      
      if(mode==='signup'){
        const data = await apiRequest('/auth/register', { method:'POST', body:{ name: form.name, email: form.email, password: form.password } })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        alert('Account created successfully!')
      } else {
        const data = await apiRequest('/auth/login', { method:'POST', body:{ email: form.email, password: form.password } })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        alert('Login successful!')
      }
      window.location.href = '/'
    }catch(err){
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed')
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{mode==='signup' ? 'Sign Up' : 'Login'}</h1>
        <div className='loginsignup-fields'>
          {mode==='signup' && (
            <input name='name' value={form.name} onChange={onChange} type='text' placeholder='Your Name' />
          )}
          <input name='email' value={form.email} onChange={onChange} type='email' placeholder='Email Address'/>
          <input name='password' value={form.password} onChange={onChange} type='password' placeholder='Password'/>
          <button onClick={onSubmit} disabled={loading}>{loading ? 'Please wait…' : 'Continue'}</button>
          {error && <p style={{ color:'#ec1c24', marginTop:8 }}>{error}</p>}
        </div>
        
        <p className="loginsignup-login">
          {mode==='signup' ? (
            <>Already have an account ? <span onClick={()=>setMode('login')} style={{ cursor:'pointer' }}>Login here</span></>
          ) : (
            <>New here? <span onClick={()=>setMode('signup')} style={{ cursor:'pointer' }}>Create an account</span></>
          )}
        </p>
        <div className='loginsignup-agree'>
          <input type='checkbox' name='' id=''/>
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup