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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="mb-6 flex justify-end gap-4 print:hidden">
          <Button 
            onClick={onDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            📄 Download PDF
          </Button>
          <Button 
            onClick={onPrint}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg"
          >
            🖨️ Print
          </Button>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {!order && loading && (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invoice...</p>
            </div>
          )}
          
          {error && (
            <div className="p-8 text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">❌ Error</div>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          
          {order && (
            <div className="p-8">
              {/* Header */}
              <div className="border-b-2 border-gray-200 pb-8 mb-8 print:hidden-header invoice-header">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <div className="text-gray-600">
                      <p className="text-lg font-semibold">Jewelry Store</p>
                      <p>123 Business Street, Suite 100</p>
                      <p>Mumbai, Maharashtra 400001</p>
                      <p>India</p>
                      <p className="mt-2">📧 info@jewelrystore.com</p>
                      <p>📞 +91 98765 43210</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-600 text-white p-4 rounded-lg">
                      <p className="text-sm font-medium">Invoice #</p>
                      <p className="text-xl font-bold">{order._id?.slice(-8) || 'N/A'}</p>
                    </div>
                    <div className="mt-4 text-gray-600">
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-lg">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="mt-2 text-gray-600">
                      <p className="text-sm font-medium">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Bill To
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">Customer</p>
                    <p className="text-gray-600">Email: customer@example.com</p>
                    <p className="text-gray-600">Phone: +91 98765 43210</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🚚</span>
                    Ship To
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">Shipping Address</p>
                    <p className="text-gray-600">{order.shippingAddress?.line1 || 'N/A'}</p>
                    {order.shippingAddress?.line2 && <p className="text-gray-600">{order.shippingAddress.line2}</p>}
                    <p className="text-gray-600">
                      {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.postalCode || 'N/A'}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress?.country || 'India'}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📦</span>
                  Order Items
                </h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Qty</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="h-16 w-16 rounded-lg object-cover mr-4 border border-gray-200"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-500">Product ID: {item.product}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                            ₹{item.price?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-900 font-bold">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="max-w-md ml-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">₹{order.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold text-gray-900">₹0</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-2xl font-bold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">₹{order.total?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-gray-600">Credit Card / UPI</p>
                    <p className="text-sm text-gray-500">Payment processed securely</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                    <p className="text-gray-600">Standard Shipping</p>
                    <p className="text-sm text-gray-500">3-5 business days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                    <p className="text-gray-600">24/7 Customer Service</p>
                    <p className="text-sm text-gray-500">support@jewelrystore.com</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
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


