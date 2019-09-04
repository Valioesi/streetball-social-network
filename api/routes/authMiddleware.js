/**
 * this middleware checks if there is a correct auth token -> uses to protect certain (pretty much all) routes
 */
module.exports = (req, res, next) => {
    const jwt = require('jsonwebtoken');
    const config = require('./../config.js');
    //check if there is a token in the request body or in request params
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        //check if token is correct
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ success: false, message: 'Token not verified'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).send({ success: false, message: 'No auth token found'});
    }
}