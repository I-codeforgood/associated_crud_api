const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') == undefined ? "" : req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized - No token provided'
        });
    }

    try {
        console.log("token", token)
        const decoded = jwt.verify(token, "My Secret Key");
        console.log("Problem", token)
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            message: 'Unauthorized - Invalid token'
        });
    }
};

module.exports = verifyToken;