import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShopContextProvider from './Context/ShopContext.jsx'
import WishlistProvider from './Context/WishlistContext.jsx'
import RecentlyViewedProvider from './Context/RecentlyViewedContext.jsx'
import ToastProvider from './Context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ShopContextProvider>
  <WishlistProvider>
  <RecentlyViewedProvider>
  <ToastProvider>
  <App />
  </ToastProvider>
  </RecentlyViewedProvider>
  </WishlistProvider>
  </ShopContextProvider>
  
  // </StrictMode>,
)
