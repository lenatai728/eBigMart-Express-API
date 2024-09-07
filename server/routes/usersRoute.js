const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUser, getUser, addItem, deleteItem, updateItem } = require('../controllers/usersController');
const { verifyToken } = require('../verifyToken');

router.get('/', getAllUsers);
router.get('/find/:id', getUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

router.post('/checkout/add/:id', verifyToken, addItem);
router.post('/checkout/delete/:id', verifyToken, deleteItem);
router.post('/checkout/update/:id', verifyToken, updateItem);

module.exports = router;