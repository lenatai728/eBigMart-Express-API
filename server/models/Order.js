const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Order', orderSchema);