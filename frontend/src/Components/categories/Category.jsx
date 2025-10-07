import React from 'react'
import nk from '../../assets/img/nacklase/nack-cat.webp'
import br from '../../assets/img/Bracelets/bracelets-cat.webp'
import ch from '../../assets/img/chain/chains-cat.webp'
import eri from '../../assets/img/EarRing/earrings-cat.webp'
import rg from '../../assets/img/ring/rings-cat.jpg'
import wh from '../../assets/img/watch/w2.jpeg'
 
import "./cate.css"

import { Link } from 'react-router-dom'
const Category = () => {
  return (
    <div className='category'>
      <div className="cat-item">
        <Link to="/necklace" > 
         <img src={nk} alt="" />
            <h3>Necklace</h3>
         </Link>
           
      </div>

      <div className="cat-item">
        <Link to="/ring" > 
         <img src={rg} alt="" />
            <h3>Ring</h3>
         </Link>
           
      </div>
      <div className="cat-item">
        <Link to="/earrings" > 
         <img src={eri} alt="" />
            <h3>Earrings</h3>
         </Link>
           
      </div>

      <div className="cat-item">
        <Link to="/chain" > 
         <img src={ch} alt="" />
            <h3>Chain</h3>
         </Link>
           
      </div>

      <div className="cat-item">
        <Link to="/watch" > 
         <img src={wh} alt="" />
            <h3>Watch</h3>
         </Link>
           
      </div>

       <div className="cat-item">
        <Link to="/bracelets" > 
         <img src={br} alt="" />
            <h3>Bracelets</h3>
         </Link>
           
      </div>
    </div>
  )
}

export default Category