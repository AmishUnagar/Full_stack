import React, { useEffect, useState } from 'react'
import "./Navbar.css"
import logo from "../../assets/img/logo.png"
import cart_icon from "../../assets/cart_icon.png"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import { apiRequest } from '../../utils/api'
const Navbar = () => {
    const [menu,setMenu]=useState("home")
    const [authed, setAuthed] = useState(false)
    const [userName, setUserName] = useState('')
    const {getTotalCartItems} = useContext(ShopContext)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            setAuthed(true)
            // try load user name silently
            apiRequest('/auth/me').then(({ user })=>{
                if(user?.name) setUserName(user.name)
            }).catch(()=>{})
        }
    },[])

    function logout(){
        localStorage.removeItem('token')
        setAuthed(false)
        setUserName('')
        window.location.href = '/'
    }
  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" height="100px" />
        
        </div>
        <ul className='nav-menu'>
            <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/">Home</Link>{menu==="home" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("about")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/about">About</Link>{menu==="about" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("shopping")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/shopping">shop</Link>{menu==="shopping" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("contact")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/contact">Contact us</Link>{menu==="contact" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("wishlist")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/wishlist">Wishlist</Link>{menu==="wishlist" ? <hr/>:<></>}</li>
            {/* <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/mens">Men
            </Link>{menu==="mens" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/womens">Women
            </Link>{menu==="womens" ? <hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:"none",color:"#626262"}} to="/kids">Kids</Link>{menu==="kids" ? <hr/>:<></>}</li> */}
        </ul>
        <div className="nav-login-cart">
           {!authed ? (
            <Link to="/login"> <button>Login</button></Link>
           ) : (
            <>
              <Link to="/profile" style={{textDecoration:'none'}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{width:32,height:32,borderRadius:16,background:'#ffe6e7',display:'flex',alignItems:'center',justifyContent:'center',color:'#ec1c24',fontWeight:600}}>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{color:'#626262', fontSize:14}}>Profile</span>
                </div>
              </Link>
              <button onClick={logout}>Logout</button>
            </>
           )}
            <Link to="/cart"><img src={cart_icon} alt="" height="40px" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar