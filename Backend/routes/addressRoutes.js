import express from 'express';
import { saveAddress, getAddresses } from '../controllers/addressController.js'; 
const router = express.Router();

// POST /api/address/add
router.post('/add', saveAddress);

// GET /api/address/:userId
router.get('/:userId', getAddresses);

export default router;
