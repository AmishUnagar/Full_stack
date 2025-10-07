import React, { useContext, useEffect, useMemo, useState } from 'react'
import "../CSS/ShopCategory.css"
import { ShopContext } from '../Context/ShopContext'
import { apiRequest } from '../utils/api'
import dropdown_icon from "../assets/dropdown_icon.png"
import Item from '../Components/Item/Item'
const ShopCategory = (props) => {
  const {all_product}=useContext(ShopContext);
  const [apiProducts, setApiProducts] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('relevant')

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        setLoading(true); setError('')
        const params = new URLSearchParams({ category: props.category })
        if (sort === 'price_low_high') params.set('sort','price_asc')
        if (sort === 'price_high_low') params.set('sort','price_desc')
        if (sort === 'popular') params.set('sort','popular')
        const { products } = await apiRequest(`/products?${params.toString()}`)
        if(mounted) setApiProducts(products.map(p=>({
          id: p._id,
          name: p.title,
          image: Array.isArray(p.images) && p.images[0] ? p.images[0] : '',
          new_price: p.price,
          old_price: p.originalPrice || p.price,
          category: p.category,
        })))
      }catch(e){
        if(mounted) setError('Unable to load products. Showing local items.')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [props.category, sort])

  const filtered = useMemo(()=>{
    let source = apiProducts || all_product
    let list = source.filter(item => props.category === item.category && (!query.trim() || item.name.toLowerCase().includes(query.toLowerCase())))
    if (sort === 'price_low_high') list = [...list].sort((a,b)=> Number(a.new_price) - Number(b.new_price))
    if (sort === 'price_high_low') list = [...list].sort((a,b)=> Number(b.new_price) - Number(a.new_price))
    if (sort === 'popular') list = [...list] // placeholder; could sort by rating when available
    return list
  }, [apiProducts, all_product, props.category, query, sort])
  
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className='shopcategory-indexSort'>
          {error && <div style={{ color:'#ec1c24' }}>{error}</div>}
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <input
            placeholder='Search in category...'
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, minWidth:220 }}
          />
          <div className='shopcategory-sort' style={{ display:'flex', alignItems:'center', gap:8 }}>
            Sort by <img src={dropdown_icon} alt="" height="20px"/>
            <select value={sort} onChange={(e)=>setSort(e.target.value)} style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:8 }}>
              <option value='relevant'>Relevant</option>
              <option value='price_low_high'>Price: Low to High</option>
              <option value='price_high_low'>Price: High to Low</option>
            </select>
          </div>
          <span style={{ color:'#666', fontSize:14 }}>{filtered.length} items</span>
        </div>
      </div>
      <div className="shopcategory-products">
        {loading && <div style={{ margin:'8px 0', color:'#666' }}>Loading…</div>}
        {filtered.map((item,i)=> (
          <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        ))}

  
      </div>
     


      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory