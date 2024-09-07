const { handleError } = require("./error");
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) return next(handleError(401, 'TokenError: User not authenticated'));
    
    jwt.verify(token, process.env.JWT, (error, user) => {
        if(error) return next(handleError(403, 'Token not valid'));
        req.user = user;
        next();
    })
}