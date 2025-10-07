import React, { useContext, useMemo } from 'react'
import { WishlistContext } from '../Context/WishlistContext'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'

const Wishlist = () => {
  const { wishlistIds, clearWishlist } = useContext(WishlistContext)
  const { all_product } = useContext(ShopContext)
  const items = useMemo(()=> all_product.filter(p => wishlistIds.includes(p.id)), [wishlistIds, all_product])
  return (
    <div className='popular' style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "30px", marginRight: "20px" }}>
      <h1>Wishlist</h1>
      <hr />
      <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', margin:'12px 0' }}>
        <button onClick={clearWishlist} style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fff' }}>Clear Wishlist</button>
        <span style={{ color: '#666', fontSize: 14 }}>{items.length} items</span>
      </div>
      <div className='popular-item'>
        {items.map((item,i)=> (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        ))}
      </div>
    </div>
  )
}

export default Wishlist


