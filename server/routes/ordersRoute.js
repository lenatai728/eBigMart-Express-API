const express = require('express');
const router = express.Router();
const { purchase, getAllOrders, getUserOrders } = require('../controllers/ordersController');
const { verifyToken } = require('../verifyToken');

router.get('/', getAllOrders);
router.post('/purchase', verifyToken, purchase);
router.get('/:id', verifyToken, getUserOrders);

module.exports = router;