import React, { useContext, useMemo, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card'
import { Button } from '../Components/ui/button'
import { apiRequest } from '../utils/api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Invoice = () => {
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      window.location.href = '/login'
    }
  },[])
  const { all_product } = useContext(ShopContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    async function load(){
      try{
        setLoading(true); setError('')
        const lastId = localStorage.getItem('lastOrderId')
        if(lastId){
          const { order } = await apiRequest(`/orders/${lastId}`)
          setOrder(order)
        } else {
          const { orders } = await apiRequest('/orders')
          setOrder(orders[0])
        }
      }catch(e){ setError('Unable to load your order') }
      finally{ setLoading(false) }
    }
    load()
  }, [])

  const onDownloadPDF = async () => {
    // Temporarily hide the header for PDF generation
    const headerElement = document.querySelector('.invoice-header');
    const originalDisplay = headerElement?.style.display;
    if (headerElement) {
      headerElement.style.display = 'none';
    }
    
    const element = document.getElementById('invoice-content');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Restore the header display
    if (headerElement) {
      headerElement.style.display = originalDisplay || '';
    }
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`invoice-${order?._id?.slice(-8) || 'order'}.pdf`);
  };

  const onPrint = () => {
    window.print();
  };

  return (
     <div className="min-h-screen bg-gray-50 py-8 oh-invoice-page">
  <div className="max-w-4xl mx-auto px-4 oh-invoice-container">
    {/* Action Buttons */}
    <div className="mb-6 flex justify-end gap-4 print:hidden oh-invoice-actions">
      <Button 
        onClick={onDownloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg oh-invoice-download-btn"
      >
        📄 Download PDF
      </Button>
      <Button 
        onClick={onPrint}
        variant="outline"
        className="border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg oh-invoice-print-btn"
      >
        🖨️ Print
      </Button>
    </div>

    {/* Invoice Content */}
    <div id="invoice-content" className="bg-white shadow-2xl rounded-lg overflow-hidden oh-invoice-content">
      {!order && loading && (
        <div className="p-8 text-center oh-invoice-loading">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 oh-invoice-loading-spinner"></div>
          <p className="text-gray-600 oh-invoice-loading-text">Loading invoice...</p>
        </div>
      )}
      
      {error && (
        <div className="p-8 text-center oh-invoice-error">
          <div className="text-red-500 text-lg font-semibold mb-2 oh-invoice-error-title">❌ Error</div>
          <p className="text-gray-600 oh-invoice-error-text">{error}</p>
        </div>
      )}
      
      {order && (
        <div className="p-8 oh-invoice-details">
          {/* Header */}
          <div className="border-b-2 border-gray-200 pb-8 mb-8 print:hidden-header oh-invoice-header">
            <div className="flex justify-between items-start oh-invoice-header-container">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 oh-invoice-title">INVOICE</h1>
                <div className="text-gray-600 oh-invoice-business-info">
                  <p className="text-lg font-semibold oh-invoice-business-name">Jewelry Store</p>
                  <p className="oh-invoice-business-address">123 Business Street, Suite 100</p>
                  <p className="oh-invoice-business-city">Mumbai, Maharashtra 400001</p>
                  <p className="oh-invoice-business-country">India</p>
                  <p className="mt-2 oh-invoice-business-email">📧 info@jewelrystore.com</p>
                  <p className="oh-invoice-business-phone">📞 +91 98765 43210</p>
                </div>
              </div>
              <div className="text-right oh-invoice-meta">
                <div className="bg-blue-600 text-white p-4 rounded-lg oh-invoice-id">
                  <p className="text-sm font-medium oh-invoice-id-label">Invoice #</p>
                  <p className="text-xl font-bold oh-invoice-id-value">{order._id?.slice(-8) || 'N/A'}</p>
                </div>
                <div className="mt-4 text-gray-600 oh-invoice-date">
                  <p className="text-sm font-medium oh-invoice-date-label">Date</p>
                  <p className="text-lg oh-invoice-date-value">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="mt-2 text-gray-600 oh-invoice-status">
                  <p className="text-sm font-medium oh-invoice-status-label">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold oh-invoice-status-value ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status?.toUpperCase() || 'PROCESSING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 oh-invoice-customer-shipping">
            <div className="oh-invoice-bill-to">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Bill To
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg oh-invoice-bill-to-info">
                <p className="font-semibold text-gray-900 oh-invoice-customer-name">Customer</p>
                <p className="text-gray-600 oh-invoice-customer-email">Email: customer@example.com</p>
                <p className="text-gray-600 oh-invoice-customer-phone">Phone: +91 98765 43210</p>
              </div>
            </div>
            
            <div className="oh-invoice-ship-to">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🚚</span>
                Ship To
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg oh-invoice-ship-to-info">
                <p className="font-semibold text-gray-900 oh-invoice-shipping-name">Shipping Address</p>
                <p className="text-gray-600 oh-invoice-shipping-line1">{order.shippingAddress?.line1 || 'N/A'}</p>
                {order.shippingAddress?.line2 && <p className="text-gray-600 oh-invoice-shipping-line2">{order.shippingAddress.line2}</p>}
                <p className="text-gray-600 oh-invoice-shipping-city-state">
                  {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.postalCode || 'N/A'}
                </p>
                <p className="text-gray-600 oh-invoice-shipping-country">{order.shippingAddress?.country || 'India'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 oh-invoice-items">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center oh-invoice-items-title">
              <span className="mr-2">📦</span>
              Order Items
            </h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg oh-invoice-items-table-wrapper">
              <table className="w-full oh-invoice-items-table">
                <thead className="bg-gray-50 oh-invoice-items-header">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 oh-invoice-items-th">Item</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 oh-invoice-items-th">Qty</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 oh-invoice-items-th">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 oh-invoice-items-th">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 oh-invoice-items-body">
                  {order.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 oh-invoice-item-row">
                      <td className="px-6 py-4 oh-invoice-item-name">
                        <div className="flex items-center oh-invoice-item-name-wrapper">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="h-16 w-16 rounded-lg object-cover mr-4 border border-gray-200 oh-invoice-item-image"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 oh-invoice-item-title">{item.title}</p>
                            <p className="text-sm text-gray-500 oh-invoice-item-id">Product ID: {item.product}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center oh-invoice-item-qty">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold oh-invoice-item-qty-badge">{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-semibold oh-invoice-item-price">
                        ₹{item.price?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-bold oh-invoice-item-total">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-6 rounded-lg oh-invoice-totals">
            <div className="max-w-md ml-auto oh-invoice-totals-wrapper">
              <div className="space-y-3 oh-invoice-totals-content">
                <div className="flex justify-between text-lg oh-invoice-subtotal">
                  <span className="text-gray-600 oh-invoice-subtotal-label">Subtotal:</span>
                  <span className="font-semibold text-gray-900 oh-invoice-subtotal-value">₹{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-lg oh-invoice-shipping">
                  <span className="text-gray-600 oh-invoice-shipping-label">Shipping:</span>
                  <span className="font-semibold text-green-600 oh-invoice-shipping-value">FREE</span>
                </div>
                <div className="flex justify-between text-lg oh-invoice-tax">
                  <span className="text-gray-600 oh-invoice-tax-label">Tax:</span>
                  <span className="font-semibold text-gray-900 oh-invoice-tax-value">₹0</span>
                </div>
                <div className="border-t border-gray-300 pt-3 oh-invoice-total">
                  <div className="flex justify-between text-2xl font-bold oh-invoice-total-wrapper">
                    <span className="text-gray-900 oh-invoice-total-label">Total:</span>
                    <span className="text-blue-600 oh-invoice-total-value">₹{order.total?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200 oh-invoice-footer">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center oh-invoice-footer-grid">
              <div className="oh-invoice-footer-payment">
                <h4 className="font-semibold text-gray-900 mb-2 oh-invoice-footer-payment-title">Payment Method</h4>
                <p className="text-gray-600 oh-invoice-footer-payment-method">Credit Card / UPI</p>
                <p className="text-sm text-gray-500 oh-invoice-footer-payment-note">Payment processed securely</p>
              </div>
              <div className="oh-invoice-footer-delivery">
                <h4 className="font-semibold text-gray-900 mb-2 oh-invoice-footer-delivery-title">Delivery</h4>
                <p className="text-gray-600 oh-invoice-footer-delivery-method">Standard Shipping</p>
                <p className="text-sm text-gray-500 oh-invoice-footer-delivery-note">3-5 business days</p>
              </div>
              <div className="oh-invoice-footer-support">
                <h4 className="font-semibold text-gray-900 mb-2 oh-invoice-footer-support-title">Support</h4>
                <p className="text-gray-600 oh-invoice-footer-support-contact">24/7 Customer Service</p>
                <p className="text-sm text-gray-500 oh-invoice-footer-support-email">support@jewelrystore.com</p>
              </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm oh-invoice-footer-note">
              <p>Thank you for your business! We appreciate your trust in our jewelry.</p>
              <p className="mt-2">This invoice was generated on {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

  )
}

export default Invoice


