import React from 'react'
import "./Newsletter.css"
import bg from '../../assets/img/banner/dhome_v2.jpg'
const Newsletter = () => {
  return (
    <div className='newsletter' style={{ backgroundImage: `url(${bg})` }}
    > 

        <h1>Get Exclusive Offers on Your Email</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div>
            <input type='email' placeholder='Your Email id'/>
            <button>Subscribe</button>
        </div>
   
    </div>
  )
}

export default Newsletter