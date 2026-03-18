const jwt = require('jsonwebtoken')
const pool = require('../config/db');

exports.protect = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: 'token undefined'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const matchId = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
        const userId = matchId.rows[0];

        if (!userId) {
            return res.status(401).json({message: 'User does not exist'})
        }

        req.user = userId
        next();
    } catch (error) {
        return res.status(401).json({message: 'invalid token'})
    }
}