const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleError } = require('../error');

exports.signup = async (req, res, next) => {
    try {
        // hash user's password for security
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        const { password, ...othersData } = newUser._doc;

        // create token for cookies
        const token = jwt.sign({ id: newUser._id }, process.env.JWT);
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(othersData);
    }
    catch (error) {
        next(error);
    }
}

exports.signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if(!user) return next(handleError(404, 'SignInError: User not found'));
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isCorrect) return next(handleError(400, 'SignInError: Wrong password'));

        const { password, ...othersData } = user._doc;

        // create token for cookies
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(othersData);
    }
    catch (error) { next(error); }
}

