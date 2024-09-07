const { handleError } = require("../error");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) { next(error); }
};
// POST req: {id: userId}
exports.purchase = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.id);
        if (!user) {
            return next(handleError(404, 'PurchaseError: User not found'));
        }
        const checkout = user.checkout;
        if (checkout.length === 0) {
            return next(handleError(404, 'PurchaseError: No items in your checkout'));
        }
        const totalAmount = checkout.reduce((total, item) => total += item.totalPrice, 0);
        // Create an order
        const newOrder = new Order(
            {
                userId: req.body.id,
                items: checkout,
                totalAmount: totalAmount,
                orderDate: Date.now()
            }
        );
        await newOrder.save();
        user.checkout = [];
        await user.save();
        res.status(200).json('Order Added');
    }
    catch (error) { next(error); }
}
// GET orders/:id (user Id)
exports.getUserOrders = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return next(handleError(404, 'GetOrdersError: User not found'));
        }
        const orders = await Order.find();
        if(orders.length === 0) {
            return next(handleError(404, 'GetOrdersError: No any orders'));
        }
        const userOrders = orders.filter(order => order.userId == req.params.id);
        if(userOrders.length === 0) {
            return next(handleError(404, 'GetOrdersError: No any orders in user list'));
        }
        res.status(200).json(userOrders);
    }
    catch(error){ next(error); }
}
// PUT orders/:id (order Id)
exports.updateOrder = async (req, res, next) => {}