const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const productsRoute = require('./routes/productsRoute')
const usersRoute = require('./routes/usersRoute')
const authsRoute = require('./routes/authsRoute');
const ordersRoute = require('./routes/ordersRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => console.log('mongoDB is connected'))
        .catch(err => console.log('connect error: ', err));
}

app.use('/api/products', productsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auths', authsRoute);
app.use('/api/orders', ordersRoute);

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
    connect();
    console.log(`server running at ${PORT}`);
})
