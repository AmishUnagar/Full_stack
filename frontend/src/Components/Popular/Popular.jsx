import React, { useContext } from 'react'
import "./Popular.css"
import Item from "../Item/Item"
import { ShopContext } from '../../Context/ShopContext'

const Popular = () => {
  const { all_product } = useContext(ShopContext)
  
  // Show only first 8 products for popular items
  const popularProducts = all_product.slice(0, 8)
  
  return (
    <div className='popular'>
      <h1>POPULAR ITEMS</h1>
      <hr/>
      <div className='popular-item'>
        {popularProducts.map((item,i)=>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular