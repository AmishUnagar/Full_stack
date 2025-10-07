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
          <div className="text-center mb-8">
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
                  className={`flex-1 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
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
            className="space-y-8"
          >
            {/* Personal Information Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <span className="mr-3 text-3xl">👤</span>
                  Personal Information
                </CardTitle>
                <p className="text-blue-100 mt-2">Update your personal details and profile picture</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={onSave} className="space-y-8">
                  {/* Avatar Section */}
                  <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                    <div className="flex items-center gap-10">
                      <div className="relative">
                        <Avatar src={avatar} className="h-28 w-28 border-4 border-white shadow-lg" />
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                          <span className="text-sm">📷</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="avatar" className="text-lg font-semibold text-gray-700 block mb-4">
                          Profile Picture
                        </Label>
                        <div className="space-y-4">
                          <Input 
                            id="avatar" 
                            type="file" 
                            accept="image/*" 
                            onChange={onAvatarChange} 
                            className="w-full py-4 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                          />
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="mr-2">💡</span>
                            JPG, PNG or GIF. Max size 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <span className="px-4 text-gray-500 font-medium">Basic Information</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">👤</span>
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={form.name} 
                        onChange={onChange} 
                        className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                        placeholder="Enter your full name"
                        required 
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">📧</span>
                        Email Address
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={onChange} 
                        className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl bg-gray-100 text-lg cursor-not-allowed" 
                        disabled 
                      />
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">🔒</span>
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="phone" className="text-base font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">📱</span>
                        Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={form.phone} 
                        onChange={onChange} 
                        className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="country" className="text-base font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">🌍</span>
                        Country
                      </Label>
                      <Input 
                        id="country" 
                        name="address.country" 
                        value={form.address.country} 
                        onChange={onChange} 
                        className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                        placeholder="Enter your country"
                      />
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <span className="px-4 text-gray-500 font-medium">Shipping Address</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="mr-3 text-2xl">🏠</span>
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <Label htmlFor="line1" className="text-base font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">📍</span>
                          Address Line 1
                        </Label>
                        <Input 
                          id="line1" 
                          name="address.line1" 
                          value={form.address.line1} 
                          onChange={onChange} 
                          className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                          placeholder="Street address, P.O. box"
                        />
                      </div>
                      <div className="lg:col-span-2 space-y-4">
                        <Label htmlFor="line2" className="text-base font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🏢</span>
                          Address Line 2
                        </Label>
                        <Input 
                          id="line2" 
                          name="address.line2" 
                          value={form.address.line2} 
                          onChange={onChange} 
                          className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                          placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="city" className="text-base font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🏙️</span>
                          City
                        </Label>
                        <Input 
                          id="city" 
                          name="address.city" 
                          value={form.address.city} 
                          onChange={onChange} 
                          className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="state" className="text-base font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🗺️</span>
                          State
                        </Label>
                        <Input 
                          id="state" 
                          name="address.state" 
                          value={form.address.state} 
                          onChange={onChange} 
                          className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                          placeholder="Enter your state"
                        />
              </div>
                      <div className="space-y-4">
                        <Label htmlFor="postalCode" className="text-base font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">📮</span>
                          Postal Code
                        </Label>
                        <Input 
                          id="postalCode" 
                          name="address.postalCode" 
                          value={form.address.postalCode} 
                          onChange={onChange} 
                          className="w-full py-5 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg" 
                          placeholder="Enter postal code"
                        />
              </div>
              </div>
              </div>

                  {/* Save Button */}
                  <div className="flex justify-center pt-8">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-3">⏳</span>
                          Saving Changes...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-3">💾</span>
                          Save Changes
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Orders</p>
                      <p className="text-3xl font-bold">{orderStats.total}</p>
                    </div>
                    <span className="text-4xl">📦</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Delivered</p>
                      <p className="text-3xl font-bold">{orderStats.delivered}</p>
                    </div>
                    <span className="text-4xl">✅</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Processing</p>
                      <p className="text-3xl font-bold">{orderStats.processing}</p>
                    </div>
                    <span className="text-4xl">⏳</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Spent</p>
                      <p className="text-3xl font-bold">₹{orderStats.totalSpent.toLocaleString()}</p>
                    </div>
                    <span className="text-4xl">💰</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Bar */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Search orders by product name or order ID..."
                        className="w-full py-4 px-6 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                    </div>
                    <select className="py-4 px-6 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                      <option value="">All Status</option>
                      <option value="delivered">Delivered</option>
                      <option value="shipped">Shipped</option>
                      <option value="processing">Processing</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <Button className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg">
                    Filter Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <span className="mr-3 text-3xl">📦</span>
                  Order History
                </CardTitle>
                <p className="text-green-100 mt-2">Track your orders and their current status</p>
              </CardHeader>
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/shopping">
                      <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {orders.map((order, index) => (
                    <motion.div 
                      key={order._id || order.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="p-6">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                              <span className="text-2xl">📦</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Order #{order._id?.slice(-8) || order.id}</h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                <span className="mr-2">📅</span>
                                Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{order.total || order.price}</p>
                            <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          {order.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-6 bg-gray-50 rounded-xl p-4">
                              <div className="relative">
                                <img 
                                  src={item.image || '/src/assets/img/ring/ring1.webp'} 
                                  className="h-20 w-20 rounded-xl object-cover shadow-lg border-4 border-white" 
                                  alt={item.title || item.name} 
                                />
                                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg">
                                  <span className="text-xs">📦</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title || item.name}</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <span className="mr-2">📦</span>
                                    Quantity: {item.quantity || 1}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="mr-2">🚚</span>
                                    Free Shipping
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">₹{(item.price || 0) * (item.quantity || 1)}</p>
                                <p className="text-sm text-gray-500">Per item: ₹{item.price || 0}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="outline" 
                              className="px-4 py-2 rounded-lg"
                              onClick={() => {
                                localStorage.setItem('lastOrderId', order._id || order.id);
                                window.open('/invoice', '_blank');
                              }}
                            >
                              <span className="mr-2">👁️</span>
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              className="px-4 py-2 rounded-lg"
                              onClick={() => {
                                localStorage.setItem('lastOrderId', order._id || order.id);
                                window.open('/invoice', '_blank');
                              }}
                            >
                              <span className="mr-2">📄</span>
                              Download Invoice
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" className="px-4 py-2 rounded-lg">
                                <span className="mr-2">🔄</span>
                                Reorder
                              </Button>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
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

            {/* Pagination */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Showing 1-3 of 12 orders</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="px-4 py-2 rounded-lg">
                      Previous
                    </Button>
                    <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      1
                    </Button>
                    <Button variant="outline" className="px-4 py-2 rounded-lg">
                      2
                    </Button>
                    <Button variant="outline" className="px-4 py-2 rounded-lg">
                      3
                    </Button>
                    <Button variant="outline" className="px-4 py-2 rounded-lg">
                      Next
            </Button>
                  </div>
                </div>
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
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
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
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
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


