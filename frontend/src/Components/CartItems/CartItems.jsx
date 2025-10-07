import React, { useContext } from 'react'
import "./CartItems.css"
import remove_icon from "../../assets/remove.webp"
import { ShopContext } from '../../Context/ShopContext'
import { Button } from '../ui/button'
import { ToastContext } from '../../Context/ToastContext'
const CartItems = () => {
    const { getTotalCartAmount,all_product, cartItems, removeFromCart, addTocart, setQuantity, clearCart } = useContext(ShopContext);
    const { show } = useContext(ToastContext)
    return (
        <div className='cartItems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div>
                        <div className='cartItems-format cartitems-format-main'>
                            <img src={e.image} alt="" height="100px" />
                            <p>{e.name}</p>
                            <p>${e.new_price}</p>
                            <div className='cartitems-quantity'>
                                <button onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFromCart(e.id); 
                                  show('Removed one');
                                }}>-</button>
                                <input value={cartItems[e.id]} onChange={(ev)=>setQuantity(e.id, ev.target.value)} />
                                <button onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addTocart(e.id); 
                                  show('Added one');
                                }}>+</button>
                            </div>
                            <p>{e.new_price*cartItems[e.id]}</p>
                            <img src={remove_icon} alt="" onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFromCart(e.id); 
                              show('Removed from cart');
                            }} height="20px"/>
                        </div>
                        <hr/>
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                {getTotalCartAmount() === 0 && (
                  <div style={{textAlign:'center', padding:'16px 0', color:'#666'}}>
                    Your cart is empty. <a href="/shopping" style={{ color:'#ec1c24' }}>Continue shopping</a>
                  </div>
                )}
                <div className="cartitems-total">
                    <h1>cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Total</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                    </div>
                    <div style={{display:'flex', gap:12}}>
                      <a href="/checkout"><button onClick={(e) => {
                        e.preventDefault();
                        show('Proceeding to checkout');
                      }}>PROCEED TO CHECKOUT</button></a>
                      <Button variant="outline" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearCart(); 
                        show('Cart cleared');
                      }}>Clear Cart</Button>
                    </div>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cartitems-promobox">
                        <input type='text' placeholder='promo code'/>
                        <button onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add promo code logic here
                        }}>submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems