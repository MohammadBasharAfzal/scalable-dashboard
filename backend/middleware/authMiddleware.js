// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'No token provided' }); // Forbidden
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
        }
        req.userId = decoded.id; // Attach user ID to request object
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authMiddleware;
