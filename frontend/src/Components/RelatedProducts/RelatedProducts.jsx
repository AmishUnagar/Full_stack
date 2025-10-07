import React, { useContext, useMemo } from 'react'
import "./RealatedProducts.css"
import Item from '../Item/Item'
import data_product from '../../assets/data'
import { RecentlyViewedContext } from '../../Context/RecentlyViewedContext'
const RelatedProducts = () => {
  const { recentIds } = useContext(RecentlyViewedContext)
  const recentItems = useMemo(()=> data_product.filter(p=>recentIds.includes(p.id)), [recentIds])
  const list = recentItems.length ? recentItems : data_product
  return (
    <div className='relatedproducts'>
        <h1>{recentItems.length ? 'Recently Viewed' : 'Related Products'}</h1>
        <hr/>
        <div className="relatedproducts-item">
            {list.map((item,i)=>{
                 return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default RelatedProducts