const jwt = require('jsonwebtoken')
const pool = require('../config/db');

exports.protect = async (req, res, next) => {
    try {
        // Splits "Bearer TOKEN" → gets TOKEN part
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: 'token undefined'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)

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

// user 1 
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2OTk2MzM5OSwiZXhwIjoxNzcwNTY4MTk5fQ.RWLGxr0aIJlKsyb0nzwqpuVeXkOmwDMt740ulSxl_ok

// user 2
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2OTcxODk0MCwiZXhwIjoxNzcwMzIzNzQwfQ.xyxKNtE3IsfEc1DvZpf6z3cQ_twmDyVNLeFaw_p0KGs

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc3MDE0MDM5NCwiZXhwIjoxNzcwNzQ1MTk0fQ.lArib8WdY3baarQ0qnObV9873BNIc0ZIeT7OcU8zV1g
//        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTc3MDE0MDQ4NSwiZXhwIjoxNzcwNzQ1Mjg1fQ.h3QJ3uTvwMHxbc9BjsefO65cNdkB0Lbul2-JNjKm7Ww