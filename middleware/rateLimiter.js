const rateLimit = require('express-rate-limit')

exports.authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5,
    message: { message: 'Too many attempts, please try again later' }
})

exports.noteLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1hr
	limit: 100, 
    message: { message: 'Too many requests, please try again later' }
})