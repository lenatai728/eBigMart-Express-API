const { handleError } = require('../error');
const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    const product = new Product(req.body);
    try {
        await product.save();
        res.status(200).json('Product created')
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updateProduct) {
            return next(handleError(404, 'UpdateProductError: Product not found'));
        }
        res.json(updateProduct);
    }
    catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product deleted');
    } catch (error) {
        next(error);
    }
};