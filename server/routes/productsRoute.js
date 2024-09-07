const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
