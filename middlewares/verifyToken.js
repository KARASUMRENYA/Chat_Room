// BACKEND/middlewares/verifyToken.js

const jwt = require('jsonwebtoken');
// Middleware to verify JWT token:.........................................
function verifyToken(req, res, next) {
    const header = req.headers['authorization'];
    if(!header) return res.status(401).json({success : false, message: 'No token provided'});

    const token = header.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Add decoded user info to request object
        next();
        }catch(error){
            res.status(401).json({success : false, message: 'Invalid token'});
        }
    }

    // Middleware to verify JWT token:.........................................
module.exports = verifyToken; 