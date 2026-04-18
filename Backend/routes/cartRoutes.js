import express from 'express';
import {
    addToCart,
    removeItem,
    updateQuantity,
    getCart
} from '../controllers/CartController.js';

const router = express.Router();

// Add item to cart 
router.post('/add',addToCart);

// Remove item from cart
router.delete('/remove',removeItem);

// Update item from cart
router.put('/update',updateQuantity);

// Get User's Cart
router.get('/:userId',getCart);

export default router;