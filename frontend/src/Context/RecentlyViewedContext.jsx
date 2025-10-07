import React, { createContext, useEffect, useState } from 'react'

export const RecentlyViewedContext = createContext(null)

export default function RecentlyViewedProvider({ children }){
  const [recentIds, setRecentIds] = useState(()=>{
    try{ const s = localStorage.getItem('recent'); return s ? JSON.parse(s) : [] }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem('recent', JSON.stringify(recentIds)) }catch{}
  }, [recentIds])

  function pushRecent(id){
    setRecentIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)]
      return next.slice(0, 8)
    })
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentIds, pushRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}


