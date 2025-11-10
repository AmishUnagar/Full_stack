import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function createTestOrder(req, res) {
  try {
    const { amount, currency = 'INR' } = req.body;
    const integerAmount = Math.round(Number(amount) * 100);

    if (!integerAmount || integerAmount <= 0) {
      return res.status(400).json({ message: 'A valid positive amount is required to create a Razorpay order.' });
    }

    if (!isRazorpayConfigured()) {
      // Mock mode: return a fake order so frontend can proceed in demo/testing without real keys
      const mockOrderId = `order_mock_${Date.now()}`;
      return res.json({
        message: 'Mock Razorpay order created (no keys configured).',
        orderId: mockOrderId,
        amount: integerAmount,
        currency,
        razorpayKeyId: 'rzp_test_mock',
        mock: true,
      });
    }

    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      amount: integerAmount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: String(req.user.id),
      },
    });

    res.json({
      message: 'Test Razorpay order created successfully.',
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Unable to create Razorpay order.',
    });
  }
}

export async function verifyTestPayment(req, res) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount,
      items = [],
      subtotal,
      total,
      shippingAddress,
    } = req.body;

    let verified = false;
    let computedTotal = total ?? (amount ? Number(amount) / 100 : undefined);

    if (!isRazorpayConfigured()) {
      // Mock mode: accept any payload as "verified"
      verified = true;
      if (!computedTotal) {
        computedTotal = 0;
      }
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ message: 'Missing Razorpay payment verification fields.' });
      }
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');
      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Invalid Razorpay signature. Payment verification failed.' });
      }
      verified = true;
    }

    if (!verified) {
      return res.status(400).json({ message: 'Payment could not be verified.' });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      subtotal: subtotal ?? computedTotal,
      total: computedTotal,
      shippingAddress,
      status: 'processing',
    });

    res.json({
      message: isRazorpayConfigured()
        ? 'Payment verified and order stored successfully.'
        : 'Mock payment accepted and order stored successfully.',
      orderId: order._id,
      invoicePath: '/invoice',
      order,
    });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Unable to verify Razorpay payment.',
    });
  }
}


