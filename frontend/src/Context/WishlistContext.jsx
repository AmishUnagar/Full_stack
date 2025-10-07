import React, { createContext, useEffect, useState } from 'react'

export const WishlistContext = createContext(null)

export default function WishlistProvider({ children }){
  const [wishlistIds, setWishlistIds] = useState(()=>{
    try{
      const raw = localStorage.getItem('wishlist')
      if(!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
      if (parsed && typeof parsed === 'object') {
        const keys = Object.keys(parsed).filter(k => parsed[k])
        return keys.map(k => (Number.isNaN(Number(k)) ? k : Number(k)))
      }
      return []
    }catch{ return [] }
  })

  useEffect(()=>{
    try{ localStorage.setItem('wishlist', JSON.stringify(wishlistIds)) }catch{}
  }, [wishlistIds])

  function toggleWishlist(id){
    console.log('toggleWishlist called with id:', id);
    console.log('Current wishlistIds before update:', wishlistIds);
    setWishlistIds(prev => {
      const list = Array.isArray(prev) ? prev : []
      const newList = list.includes(id) ? list.filter(x=>x!==id) : [...list, id]
      console.log('New wishlist:', newList);
      console.log('Setting new wishlist state');
      return newList
    })
    console.log('toggleWishlist function completed');
  }

  function clearWishlist(){ setWishlistIds([]) }

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}


