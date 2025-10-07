import Navbar from "./Components/Navbar/Navbar"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Shop from "./Pages/Shop"
import ShopCategory from "./Pages/ShopCategory"
import Product from "./Pages/Product"
import Cart from "./Pages/Cart"
import LoginSignup from "./Pages/LoginSignup"
import Footer from "./Components/Footer/Footer"
import men_banner from "./assets/banner.jpg"
import women_banner from "./assets/women_banner.avif"
import kids_banner from "./assets/kids_banner.jpg"
import ring_bnr from './assets/img/banner/banner5.jpg'
import wh_bnr from './assets/img/banner/banner3.jpg'
import neck_bnr from './assets/img/banner/banner7.jpg'
import bra_bnr from './assets/img/banner/banner11.jpg'
import ch_bnr from './assets/img/banner/banner5.jpg'
import er_bnr from './assets/img/banner/banner4.jpeg'
import Contact from './Pages/Contact'
import Shopping from './Pages/Shopping'
import About from './Pages/About'
import UserProfile from './Pages/UserProfile'
import Invoice from './Pages/Invoice'
import Checkout from './Pages/Checkout'
import Wishlist from './Pages/Wishlist'
import NotFound from './Pages/NotFound'
import Orders from './Pages/Orders'
function App() {
 
  return (
    <div >
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Shop/>}/>
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="necklace"/> }/>
        <Route path="/ring" element={<ShopCategory banner={ring_bnr} category="ring"/> }/>
        <Route path="/necklace" element={<ShopCategory banner={neck_bnr} category="necklace"/> }/>
        <Route path="/earrings" element={<ShopCategory banner={er_bnr} category="earrings"/> }/>
        <Route path="/chain" element={<ShopCategory banner={ch_bnr} category="chain"/> }/>
        <Route path="/watch" element={<ShopCategory banner={wh_bnr} category="watch"/> }/>
        <Route path="/bracelets" element={<ShopCategory banner={bra_bnr} category="bracelets"/> }/>



        <Route path="/womens" element={<ShopCategory banner={women_banner}category="women"/>}/>
        <Route path="/kids" element={<ShopCategory banner={kids_banner}category="kid"/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/shopping" element={<Shopping/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/login" element={<LoginSignup/>}/>
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/invoice" element={<Invoice/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>

    </div>
     
  )
}

export default App
