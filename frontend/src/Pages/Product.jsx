import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Bredcrums from '../Components/Bredcrums/BredCrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import Description from '../Components/Description/Description';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { apiRequest } from '../utils/api';
import { RecentlyViewedContext } from '../Context/RecentlyViewedContext';
const Product = () => {
  const {all_product} = useContext(ShopContext);
  const { pushRecent } = useContext(RecentlyViewedContext)
  const {productId} = useParams();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productApi, setProductApi] = useState(null)

  const fallback = useMemo(()=> all_product.find((e)=> e.id === parseInt(productId)), [all_product, productId])

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        setLoading(true); setError('')
        const { product } = await apiRequest(`/products/${productId}`)
        if(mounted) setProductApi({
          id: product._id, // backend id
          name: product.title,
          image: Array.isArray(product.images) && product.images[0] ? product.images[0] : (fallback?.image || ''),
          new_price: product.price,
          old_price: product.originalPrice || product.price,
          category: product.category,
        })
      }catch(e){
        if(mounted) setError('Unable to load product. Showing local data if available.')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    if(fallback?.id){ pushRecent(fallback.id) }
    return ()=>{ mounted = false }
  }, [productId])

  const product = productApi || fallback
  if(loading && !product){
    return <div style={{maxWidth: 960, margin: '40px auto', padding: '0 16px'}}><p>Loading…</p></div>
  }
  if(!product){
    return (
      <div style={{maxWidth: 960, margin: '40px auto', padding: '0 16px'}}>
        <h2>Product not found</h2>
        <p>Please check the link or browse the shop.</p>
      </div>
    )
  }
  return (
    <div>
      {error && <div style={{maxWidth: 960, margin: '16px auto', padding: '0 16px', color:'#ec1c24'}}>{error}</div>}
      <Bredcrums product={product}/>
      <ProductDisplay product={product}/>
      <Description/>
      <RelatedProducts/>
    </div>
  )
}

export default Product