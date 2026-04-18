import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;
    // 1. Get cart with product details
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 3. Prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // 4. Calculate total amount
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

   
    // 5. Deduct stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

     // 6. Create order
     const order = await Order.create({
        userId,
        items: orderItems,
        totalAmount,
        address,
        paymentMethod: 'COD',
      });
  

    // 7. Clear cart
    await Cart.findOneAndUpdate({userId},{items: []});

    // 8. Send response
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order placement failed' });
  }
};
