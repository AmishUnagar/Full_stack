import React, { useContext, useMemo, useState } from 'react'
import Item from "../Components/Item/Item"
import { ShopContext } from '../Context/ShopContext'
import { apiRequest } from '../utils/api'
const Shopping = () => {
  const { all_product } = useContext(ShopContext)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('relevant')

  const categories = useMemo(() => {
    const set = new Set(all_product.map(p => p.category))
    return ['all', ...Array.from(set)].sort()
  }, [all_product])

  const filtered = useMemo(() => {
    let list = [...all_product]
    
    // Filter by category
    if (category !== 'all') {
      list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase())
    }
    
    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    
    // Sort products
    if (sort === 'price_low_high') {
      list = list.sort((a, b) => Number(a.new_price) - Number(b.new_price))
    } else if (sort === 'price_high_low') {
      list = list.sort((a, b) => Number(b.new_price) - Number(a.new_price))
    } else if (sort === 'name_a_z') {
      list = list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'name_z_a') {
      list = list.sort((a, b) => b.name.localeCompare(a.name))
    }
    
    return list
  }, [all_product, category, query, sort])

  return (
    <div className='popular' style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "30px", marginRight: "20px" }}>
      <h1>All ITEMS</h1>
      <hr/>

      <div style={{ 
        display: 'flex', 
        gap: 12, 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <input
          placeholder='Search products...'
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          style={{ 
            padding: '12px 16px', 
            border: '2px solid #ddd', 
            borderRadius: 8, 
            minWidth: 250,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        
        <select 
          value={category} 
          onChange={(e)=>setCategory(e.target.value)} 
          style={{ 
            padding: '12px 16px', 
            border: '2px solid #ddd', 
            borderRadius: 8,
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        
        <select 
          value={sort} 
          onChange={(e)=>setSort(e.target.value)} 
          style={{ 
            padding: '12px 16px', 
            border: '2px solid #ddd', 
            borderRadius: 8,
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value='relevant'>Sort by: Relevant</option>
          <option value='price_low_high'>Price: Low to High</option>
          <option value='price_high_low'>Price: High to Low</option>
          <option value='name_a_z'>Name: A to Z</option>
          <option value='name_z_a'>Name: Z to A</option>
        </select>
        
        <div style={{ 
          color: '#666', 
          fontSize: 14, 
          fontWeight: '500',
          padding: '8px 12px',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          {filtered.length} items found
        </div>
      </div>

      <div className='popular-item' >
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            fontSize: '18px'
          }}>
            <p>No products found matching your criteria.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Try adjusting your search or filter options.</p>
          </div>
        ) : (
          filtered.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
          })
        )}
      </div>
    </div>
  )
}

export default Shopping