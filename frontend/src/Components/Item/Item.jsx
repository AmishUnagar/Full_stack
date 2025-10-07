import React, { useContext } from 'react'
import "./Item.css"
import { Link } from 'react-router-dom'
import { WishlistContext } from '../../Context/WishlistContext'
const Item = (props) => {
  const { wishlistIds, toggleWishlist } = useContext(WishlistContext)
  const wished = wishlistIds.includes(props.id)
  
  console.log('Item component rendered for product:', props.id, 'wished:', wished)
  return (
    <div className='item'>
       <Link to={`/product/${props.id}`} onClick={(e) => e.stopPropagation()}>
         <img onClick={window.scrollTo(0,0)} src={props.image} alt="" />
       </Link>
        <p>{props.name}</p>
        <div className='item-prices'>
            <div className="item-price-new">
                ${props.new_price}
            </div>
            <div className="item-price-old">
                {props.old_price}
            </div>
        </div>
        <div 
          onClick={(e) => {
            console.log('Wishlist div clicked for product:', props.id);
            console.log('Before preventDefault - event:', e);
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            e.stopImmediatePropagation();
            console.log('After preventDefault - calling toggleWishlist');
            toggleWishlist(props.id);
            console.log('After toggleWishlist call');
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }}
          style={{ 
            marginTop: 8, 
            padding: '6px 10px', 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            background: wished ? '#ffe6e7' : '#fff', 
            color: wished ? '#ec1c24' : '#333',
            cursor: 'pointer',
            display: 'inline-block',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          {wished ? '♥ Wishlisted' : '♡ Add to Wishlist'}
        </div>
    </div>
  )
}

export default Item