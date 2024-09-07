const { handleError } = require('../error');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const newUsers = [];
        users.forEach(user => {
            const { password, ...othersData } = user._doc;
            newUsers.push(othersData);
        })
        res.json(newUsers);
    } catch (error) { next(error); }
};
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return next(handleError(404, 'GetUserError: User Not Found'));
        }
        const { password, ...othersData } = user._doc;
        res.status(200).json(othersData);
    }
    catch (error) { next(error); }
};
exports.updateUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(handleError(403, 'UpdateError: user not authenticated'));
    }
    try {
        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );
        res.status(200).json('User updated');
    }
    catch (error) { next(error); }
};
exports.deleteUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(handleError(403, 'DeleteError: user not authenticated'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted');
    } catch (error) { next(error); }
};
// expected request: { id (userId), quantity }
exports.addItem = async (req, res, next) => {
    if (req.body.id !== req.user.id) {
        return next(handleError(403, 'AddItemError: user not authenticated'));
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(handleError(404, 'AddItemError: Product not found'))
        }
        const user = await User.findById(req.body.id);
        if (!user) {
            return next(handleError(404, 'AddItemError: User not found'))
        }
        if (product.stock === 0) {
            return next(handleError(403, 'AddItemError: Product Out of Stock'))
        }
        const oldItem = user.checkout.find(item => item.productId.equals(product.id));
        if (oldItem) {
            oldItem.quantity += req.body.quantity;
            oldItem.totalPrice = oldItem.quantity * product.price;
        }
        else {
            const newItem = {
                productId: product._id,
                quantity: req.body.quantity,
                price: product.price,
                totalPrice: req.body.quantity * product.price,
                dateAdded: Date.now()
            };
            user.checkout.push(newItem);
        }
        await user.save();
        product.stock -= req.body.quantity;
        await product.save();
        res.status(200).json('Item Added');
    }
    catch (error) { next(error); }
}
exports.deleteItem = async (req, res, next) => {
    if (req.body.id !== req.user.id) {
        return next(handleError(403, 'DeleteItemError: user not authenticated'));
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(handleError(404, 'DeleteItemError: Product not found'))
        }
        const user = await User.findById(req.body.id);
        if (!user) {
            return next(handleError(404, 'DeleteItemError: User not found'))
        }
        const oldItem = user.checkout.find(item => item.productId.equals(req.params.id));
        if (!oldItem) {
            return next(handleError(404, 'DeleteItemError: Product not found in checkout'))
        }

        const newCheckout = user.checkout.filter(item => !item.productId.equals(req.params.id));
        user.checkout = newCheckout;
        await user.save();

        product.stock += oldItem.quantity;
        await product.save();
        res.status(200).json('Item Deleted');
    }
    catch (error) { next(error); }
}
// for this function, updating quantity to 0 will delete the item
exports.updateItem = async (req, res, next) => {
    if (req.body.id !== req.user.id) {
        return next(handleError(403, 'UpdateItemError: user not authenticated'));
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(handleError(404, 'UpdateItemError: Product not found'));
        }
        const user = await User.findById(req.body.id);
        if (!user) {
            return next(handleError(404, 'UpdateItemError: User not found'));
        }
        if(user.checkout.length === 0) { return next(handleError(404, 'UpdateItemError: No items in your checkout')); }
        const item = user.checkout.find(item => item.productId.equals(product._id));
        if (product.stock < req.body.quantity) {
            return next(handleError(404, 'UpdateItemError: Product Out Of Stock'));
        }
        if (req.body.quantity === 0) { // delete the item from checkout
            const newCheckout = user.checkout.filter(item => !item.productId.equals(req.params.id));
            user.checkout = newCheckout;
            res.status(200).json('Item Deleted')
            await user.save();
            return;
        }
        if (req.body.quantity > item.quantity) {
            const noOfItemsAdded = req.body.quantity - item.quantity;
            product.stock -= noOfItemsAdded;
        } else {
            const noOfItemsRemoved = item.quantity - req.body.quantity;
            product.stock += noOfItemsRemoved;
        }
        item.quantity = req.body.quantity;
        item.totalPrice = item.quantity * product.price;
        await user.save();
        await product.save();
        res.status(200).json('Item Updated');
    }
    catch (error) { next(error); }
}

