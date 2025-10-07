import React, { createContext, useCallback, useEffect, useState } from 'react'

export const ToastContext = createContext(null)

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id)=> setToasts(prev => prev.filter(t => t.id !== id)), [])

  const show = useCallback((message, opts={}) => {
    const id = Math.random().toString(36).slice(2)
    const toast = { id, message, type: opts.type || 'info', timeout: opts.timeout ?? 2000 }
    setToasts(prev => [...prev, toast])
    setTimeout(() => remove(id), toast.timeout)
  }, [remove])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position:'fixed', right:16, bottom:16, display:'grid', gap:8, zIndex:1000 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: '#111', color:'#fff', padding:'10px 14px', borderRadius:8, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


