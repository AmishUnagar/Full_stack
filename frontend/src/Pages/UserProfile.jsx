import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../Components/ui/card'
import { Button } from '../Components/ui/button'
import { Input } from '../Components/ui/input'
import { Label } from '../Components/ui/label'
import { Avatar } from '../Components/ui/avatar'
import { Link } from 'react-router-dom'
import { apiRequest } from '../utils/api'

export default function UserProfile() {
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderStats, setOrderStats] = useState({
    total: 0,
    delivered: 0,
    processing: 0,
    totalSpent: 0
  })

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab])

  async function loadOrders() {
    try {
      setOrdersLoading(true)
      const data = await apiRequest('/orders')
      setOrders(data.orders || [])
      
      // Calculate stats
      const stats = {
        total: data.orders?.length || 0,
        delivered: data.orders?.filter(o => o.status === 'delivered').length || 0,
        processing: data.orders?.filter(o => o.status === 'processing').length || 0,
        totalSpent: data.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
      }
      setOrderStats(stats)
    } catch (error) {
      console.error('Failed to load orders:', error)
      setMessage('Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  // Load user data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const data = await apiRequest('/auth/me')
      setUser(data.user)
      setForm({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        address: {
          line1: data.user.address?.line1 || '',
          line2: data.user.address?.line2 || '',
          city: data.user.address?.city || '',
          state: data.user.address?.state || '',
          postalCode: data.user.address?.postalCode || '',
          country: data.user.address?.country || 'India'
        }
      })
      setAvatar(data.user.avatarUrl || '')
    } catch (error) {
      console.error('Failed to load user data:', error)
      setMessage('Failed to load profile data')
    }
  }

  function onChange(e) {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  async function onSave(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Update user profile
      const updateData = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        avatarUrl: avatar
      }
      
      await apiRequest('/auth/profile', { 
        method: 'PUT', 
        body: updateData 
      })
      
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function onChangePassword(e) {
    e.preventDefault()
    if (!passwords.current || passwords.next.length < 6 || passwords.next !== passwords.confirm) {
      setMessage('Please check password fields - new password must be at least 6 characters and match confirmation')
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      await apiRequest('/auth/change-password', { 
        method: 'POST', 
        body: {
          currentPassword: passwords.current,
          newPassword: passwords.next
        }
      })
      
      setMessage('Password updated successfully!')
      setPasswords({ current: '', next: '', confirm: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update password')
      console.error('Password update error:', error)
    } finally {
      setLoading(false)
    }
  }

  function onAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image size must be less than 2MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8 prof-head">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your account settings, view your orders, and update your personal information
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.3 }}
              className={`mb-8 p-4 rounded-xl shadow-sm border-2 ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">
                  {message.includes('successfully') ? '✅' : '❌'}
                </span>
                <span className="font-medium">{message}</span>
              </div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 mb-8">
            <nav className="flex space-x-1">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'security', label: 'Security', icon: '🔒' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={` py-4 px-6 rounded-xl profile-tab font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8 prof-info"
          >
            {/* Personal Information Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                <CardTitle className="text-2xl head-info font-bold flex items-center">
                  <span className="mr-3  text-xl">👤</span>
                  Personal Information
                </CardTitle>
                <p className="text-blue-100 mt-2">Update your personal details and profile picture</p>
              </CardHeader>
              <CardContent className="p-8">
           <form onSubmit={onSave} className="pf-form space-y-8">
  {/* Avatar Section */}
  <div className="pf-avatar-section bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
    <div className="pf-avatar-container flex items-center gap-10">
      <div className="pf-avatar-wrapper relative">
        <Avatar src={avatar} className="pf-avatar-img h-28 w-28 border-4 border-white shadow-lg" />
        <div className="pf-avatar-camera absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
          <span className="text-sm">📷</span>
        </div>
      </div>
      <div className="pf-avatar-upload flex-1">
        <Label htmlFor="avatar" className="pf-label text-lg font-semibold text-gray-700 block mb-4">
          Profile Picture
        </Label>
        <div className="pf-upload-info space-y-4">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="pf-input"
          />
          <p className="pf-info-text text-sm text-gray-500 flex items-center">
            <span className="mr-2">💡</span>
            JPG, PNG or GIF. Max size 2MB
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Basic Info */}
  <div className="pf-basic  grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="pf-field space-y-4">
      <Label htmlFor="name" className="pf-label">
        <span className="mr-2">👤</span> Full Name
      </Label>
      <Input id="name" name="name" value={form.name} onChange={onChange} className="pf-input" placeholder="Enter your full name" required />
    </div>

    <div className="pf-field space-y-4">
      <Label htmlFor="email" className="pf-label">
        <span className="mr-2">📧</span> Email Address
      </Label>
      <Input id="email" type="email" name="email" value={form.email} onChange={onChange} className="pf-input-disabled" disabled />
      <p className="pf-info-text">
        <span className="mr-2">🔒</span> Email cannot be changed
      </p>
    </div>

    <div className="pf-field space-y-4">
      <Label htmlFor="phone" className="pf-label">
        <span className="mr-2">📱</span> Phone Number
      </Label>
      <Input id="phone" name="phone" value={form.phone} onChange={onChange} className="pf-input" placeholder="+91 98765 43210" />
    </div>

    <div className="pf-field space-y-4">
      <Label htmlFor="country" className="pf-label">
        <span className="mr-2">🌍</span> Country
      </Label>
      <Input id="country" name="address.country" value={form.address.country} onChange={onChange} className="pf-input" placeholder="Enter your country" />
    </div>
  </div>

  {/* Address Section */}
  <div className="pf-address bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
    <h3 className="pf-address-title">
      <span className="mr-3 text-2xl">🏠</span> Shipping Address
    </h3>

    <div className="pf-address-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="pf-field lg:col-span-2 space-y-4">
        <Label htmlFor="line1" className="pf-label">
          <span className="mr-2">📍</span> Address Line 1
        </Label>
        <Input id="line1" name="address.line1" value={form.address.line1} onChange={onChange} className="pf-input" placeholder="Street address, P.O. box" />
      </div>

      <div className="pf-field lg:col-span-2 space-y-4">
        <Label htmlFor="line2" className="pf-label">
          <span className="mr-2">🏢</span> Address Line 2
        </Label>
        <Input id="line2" name="address.line2" value={form.address.line2} onChange={onChange} className="pf-input" placeholder="Apartment, suite, etc." />
      </div>

      <div className="pf-field space-y-4">
        <Label htmlFor="city" className="pf-label">
          <span className="mr-2">🏙️</span> City
        </Label>
        <Input id="city" name="address.city" value={form.address.city} onChange={onChange} className="pf-input" placeholder="Enter your city" />
      </div>

      <div className="pf-field space-y-4">
        <Label htmlFor="state" className="pf-label">
          <span className="mr-2">🗺️</span> State
        </Label>
        <Input id="state" name="address.state" value={form.address.state} onChange={onChange} className="pf-input" placeholder="Enter your state" />
      </div>

      <div className="pf-field space-y-4">
        <Label htmlFor="postalCode" className="pf-label">
          <span className="mr-2">📮</span> Postal Code
        </Label>
        <Input id="postalCode" name="address.postalCode" value={form.address.postalCode} onChange={onChange} className="pf-input" placeholder="Enter postal code" />
      </div>
    </div>
  </div>

  {/* Save Button */}
  <div className="pf-button-container flex justify-center pt-8">
    <Button type="submit" disabled={loading} className="pf-button">
      {loading ? (
        <span className="flex items-center">
          <span className="animate-spin mr-3">⏳</span> Saving Changes...
        </span>
      ) : (
        <span className="flex items-center">
          <span className="mr-3">💾</span> Save Changes
        </span>
      )}
    </Button>
  </div>
</form>

          </CardContent>
        </Card>
      </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Orders Header with Stats */}
             <div className="user-stats-grid">
  <div className="user-card user-card-blue">
    <div className="user-card-content">
      <div className="user-card-header">
        <div>
          <p className="user-card-subtext">Total Orders</p>
          <p className="user-card-value">{orderStats.total}</p>
        </div>
        <span className="user-card-icon">📦</span>
      </div>
    </div>
  </div>

  <div className="user-card user-card-green">
    <div className="user-card-content">
      <div className="user-card-header">
        <div>
          <p className="user-card-subtext">Delivered</p>
          <p className="user-card-value">{orderStats.delivered}</p>
        </div>
        <span className="user-card-icon">✅</span>
      </div>
    </div>
  </div>

  <div className="user-card user-card-yellow">
    <div className="user-card-content">
      <div className="user-card-header">
        <div>
          <p className="user-card-subtext">Processing</p>
          <p className="user-card-value">{orderStats.processing}</p>
        </div>
        <span className="user-card-icon">⏳</span>
      </div>
    </div>
  </div>

  <div className="user-card user-card-purple">
    <div className="user-card-content">
      <div className="user-card-header">
        <div>
          <p className="user-card-subtext">Total Spent</p>
          <p className="user-card-value">₹{orderStats.totalSpent.toLocaleString()}</p>
        </div>
        <span className="user-card-icon">💰</span>
      </div>
    </div>
  </div>
</div>


            {/* Search and Filter Bar */}
            <Card className="of-card-container">
  <CardContent className="of-card-content">
    <div className="of-card-flex">
      <div className="of-search-filter-wrapper">
        <div className="of-search-input-wrapper">
          <Input
            placeholder="Search orders by product name or order ID..."
            className="of-search-input"
          />
          <span className="of-search-icon">🔍</span>
        </div>
        <select className="of-status-select">
          <option value="">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="shipped">Shipped</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Button className="of-filter-button">
        Filter Orders
      </Button>
    </div>
  </CardContent>
</Card>


            

            {/* Orders List */}
            <Card className="oh-card-container">
  <CardHeader className="oh-card-header">
    <CardTitle className="oh-card-title">
      <span className="oh-card-icon">📦</span>
      Order History
    </CardTitle>
    <p className="oh-card-subtitle">
      Track your orders and their current status
    </p>
  </CardHeader>

  <CardContent className="oh-card-content">
    {ordersLoading ? (
      <div className="oh-loading-wrapper">
        <div className="oh-spinner"></div>
        <p className="oh-loading-text">Loading orders...</p>
      </div>
    ) : orders.length === 0 ? (
      <div className="oh-no-orders">
        <div className="oh-no-orders-icon">📦</div>
        <h3 className="oh-no-orders-title">No orders yet</h3>
        <p className="oh-no-orders-text">You haven't placed any orders yet.</p>
        <Link to="/shopping">
          <Button className="oh-start-shopping-btn">Start Shopping</Button>
        </Link>
      </div>
    ) : (
      <div className="oh-orders-list">
        {orders.map((order, index) => (
          <motion.div
            key={order._id || order.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="oh-order-card"
          >
            <div className="oh-order-content">
              {/* Order Header */}
              <div className="oh-order-header">
                <div className="oh-order-info">
                  <div className="oh-order-icon-wrapper">
                    <span className="oh-order-icon">📦</span>
                  </div>
                  <div>
                    <h3 className="oh-order-number">Order #{order._id?.slice(-8) || order.id}</h3>
                    <p className="oh-order-date">
                      <span className="mr-2">📅</span>
                      Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="oh-order-total-status">
                  <p className="oh-order-total">₹{order.total || order.price}</p>
                  <span className={`oh-order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="oh-order-items">
                {order.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="oh-order-item">
                    <div className="oh-item-image-wrapper">
                      <img
                        src={item.image || '/src/assets/img/ring/ring1.webp'}
                        className="oh-item-image"
                        alt={item.title || item.name}
                      />
                      <div className="oh-item-badge">📦</div>
                    </div>
                    <div className="oh-item-info">
                      <h4 className="oh-item-title">{item.title || item.name}</h4>
                      <div className="oh-item-details">
                        <div>📦 Quantity: {item.quantity || 1}</div>
                        <div>🚚 Free Shipping</div>
                      </div>
                    </div>
                    <div className="oh-item-price">
                      <p>₹{(item.price || 0) * (item.quantity || 1)}</p>
                      <p className="oh-item-price-per">Per item: ₹{item.price || 0}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="oh-order-actions">
                <div className="oh-action-buttons">
                  <Button className="oh-action-btn">
                    <span className="mr-2">👁️</span> View Details
                  </Button>
                  <Button className="oh-action-btn">
                    <span className="mr-2">📄</span> Download Invoice
                  </Button>
                  {order.status === 'delivered' && (
                    <Button className="oh-action-btn">
                      <span className="mr-2">🔄</span> Reorder
                    </Button>
                  )}
                </div>
                <div className="oh-order-delivery">
                  <p>Expected delivery: {order.date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


             
        

      </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Change Password Card */}
             <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm oh-change-password-card">
  <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-2xl">
    <CardTitle className="text-2xl font-bold flex items-center">
      <span className="mr-3 text-3xl">🔒</span>
      Change Password
    </CardTitle>
    <p className="text-red-100 mt-2">Update your password to keep your account secure</p>
  </CardHeader>
  <CardContent className="p-8">
    <form onSubmit={onChangePassword} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Label htmlFor="current" className="text-base font-semibold text-gray-700 flex items-center">
            <span className="mr-2">🔑</span>
            Current Password
          </Label>
          <Input 
            id="current" 
            type="password" 
            value={passwords.current} 
            onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} 
            className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-lg" 
            placeholder="Enter current password"
            required 
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="next" className="text-base font-semibold text-gray-700 flex items-center">
            <span className="mr-2">🆕</span>
            New Password
          </Label>
          <Input 
            id="next" 
            type="password" 
            value={passwords.next} 
            onChange={(e) => setPasswords(p => ({ ...p, next: e.target.value }))} 
            className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-lg" 
            placeholder="Enter new password"
            required 
            minLength={6}
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="confirm" className="text-base font-semibold text-gray-700 flex items-center">
            <span className="mr-2">✅</span>
            Confirm Password
          </Label>
          <Input 
            id="confirm" 
            type="password" 
            value={passwords.confirm} 
            onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} 
            className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-lg" 
            placeholder="Confirm new password"
            required 
          />
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
          <span className="mr-3">📋</span>
          Password Requirements:
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-center">
            <span className="mr-3">✅</span>
            At least 6 characters long
          </li>
          <li className="flex items-center">
            <span className="mr-3">✅</span>
            Use a combination of letters and numbers
          </li>
          <li className="flex items-center">
            <span className="mr-3">✅</span>
            Avoid common passwords
          </li>
        </ul>
      </div>

      {/* Update Button */}
      <div className="flex justify-center pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-3">⏳</span>
              Updating Password...
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-3">🔐</span>
              Update Password
            </span>
          )}
        </Button>
      </div>
    </form>
  </CardContent>
</Card>


            {/* Account Security Info */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm oh-account-security-card">
  <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
    <CardTitle className="text-2xl font-bold flex items-center">
      <span className="mr-3 text-3xl">🛡️</span>
      Account Security
    </CardTitle>
    <p className="text-purple-100 mt-2">Additional security features for your account</p>
  </CardHeader>
  <CardContent className="p-8">
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <span className="text-2xl">🔐</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h4>
              <p className="text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
          <Button variant="outline" disabled className="px-6 py-3 rounded-xl">
            Coming Soon
          </Button>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">Login Activity</h4>
              <p className="text-gray-600">View recent login attempts and sessions</p>
            </div>
          </div>
          <Button variant="outline" disabled className="px-6 py-3 rounded-xl">
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      </motion.div>
        )}
      </div>
    </div>
  )
}


