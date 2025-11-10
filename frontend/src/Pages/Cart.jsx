import React, { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card'
import { Button } from '../Components/ui/button'
import { Input } from '../Components/ui/input'
import { ShopContext } from '../Context/ShopContext'
import { ToastContext } from '../Context/ToastContext'
import { Link } from 'react-router-dom'
import remove_icon from '../assets/remove.webp'

const Cart = () => {
  const { 
    getTotalCartAmount, 
    all_product, 
    cartItems, 
    removeFromCart, 
    addTocart, 
    setQuantity, 
    clearCart 
  } = useContext(ShopContext)
  const { show } = useContext(ToastContext)
  
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [cartItemsList, setCartItemsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Get cart items with product details
  useEffect(() => {
    const items = all_product.filter(product => cartItems[product.id] > 0)
    setCartItemsList(items)
  }, [cartItems, all_product])

  const subtotal = getTotalCartAmount()
  const shipping = subtotal > 1000 ? 0 : 50 // Free shipping over ₹1000
  const total = subtotal + shipping - discount

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity) || 0)
    setQuantity(productId, quantity)
    if (quantity === 0) {
      show('Item removed from cart')
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
    show('Item removed from cart')
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    
    setIsApplyingPromo(true)
    // Simulate promo code validation
    setTimeout(() => {
      const validPromos = {
        'WELCOME10': 0.1,
        'SAVE20': 0.2,
        'FREESHIP': 50
      }
      
      if (validPromos[promoCode.toUpperCase()]) {
        if (promoCode.toUpperCase() === 'FREESHIP') {
          setDiscount(50)
          show('Free shipping applied!')
        } else {
          setDiscount(subtotal * validPromos[promoCode.toUpperCase()])
          show(`Discount applied: ${promoCode.toUpperCase()}`)
        }
      } else {
        show('Invalid promo code')
      }
      setIsApplyingPromo(false)
    }, 1000)
  }

  const handleClearCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      clearCart()
      show('Cart cleared')
      setIsLoading(false)
    }, 500)
  }

  const handleProceedToCheckout = () => {
    if (cartItemsList.length === 0) {
      show('Your cart is empty')
      return
    }
    show('Proceeding to checkout...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItemsList.length} {cartItemsList.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {cartItemsList.length === 0 ? (
          /* Empty Cart */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4 empty-cart-animation">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link to="/shopping">
                <Button className="px-8 py-3 text-lg">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 oh-cart-grid">
  {/* Cart Items */}
  <div className="lg:col-span-2 oh-cart-items-section">
    <Card className="oh-cart-items-card">
      <CardHeader>
        <CardTitle>Cart Items</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {cartItemsList.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-4 oh-cart-item"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 oh-cart-item-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 oh-cart-item-details">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  ₹{product.new_price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="quantity-controls oh-quantity-controls">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { removeFromCart(product.id); show('Quantity decreased'); }}
                  className="w-8 h-8 p-0"
                >-</Button>
                <Input
                  type="number"
                  value={cartItems[product.id]}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className="w-16 text-center oh-quantity-input"
                  min="0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { addTocart(product.id); show('Quantity increased'); }}
                  className="w-8 h-8 p-0"
                >+</Button>
              </div>

              {/* Total Price */}
              <div className="text-right oh-cart-item-total">
                <p className="text-lg font-semibold text-gray-900">
                  ₹{product.new_price * cartItems[product.id]}
                </p>
              </div>

              {/* Remove Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveItem(product.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 oh-cart-item-remove"
              >
                <img src={remove_icon}  alt="Remove" className="w-1 h-1 rem-btn" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  </div>

  {/* Order Summary */}
  <div className="lg:col-span-1 ord-smry oh-cart-summary-section">
    <Card className="sticky top-8 oh-cart-summary-card">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 oh-cart-summary-content">
        {/* Subtotal */}
        <div className="flex justify-between oh-summary-subtotal">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between oh-summary-shipping">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `₹${shipping}`}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600 oh-summary-discount">
            <span>Discount</span>
            <span className="font-medium">-₹{discount}</span>
          </div>
        )}

        <hr className="my-4 oh-summary-divider" />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold oh-summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        {/* Promo Code */}
        <div className="promo-code-section oh-promo-code-section">
          <label className="text-sm font-medium text-gray-700">Promo Code</label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 oh-promo-input"
            />
            <Button
              onClick={handleApplyPromo}
              disabled={isApplyingPromo || !promoCode.trim()}
              variant="outline"
              size="sm"
              className="oh-promo-apply-btn"
            >
              {isApplyingPromo ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 oh-promo-hint">
            Try: WELCOME10, SAVE20, or FREESHIP
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 oh-action-buttons">
          <Link to="/checkout" onClick={handleProceedToCheckout}>
            <Button className="w-full oh-checkout-btn">Proceed to Checkout</Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isLoading}
            className="w-full oh-clear-cart-btn"
          >
            {isLoading ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="pt-4 border-t oh-continue-shopping-section">
          <Link to="/shopping">
            <Button variant="ghost" className="w-full oh-continue-shopping-btn">Continue Shopping</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </div>
</div>

        )}

        {/* Recommended Products */}
        {cartItemsList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12"
          >
           
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Cart