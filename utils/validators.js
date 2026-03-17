const validator = require('validator')

exports.validEmail = (email) => {
    // if email empty or invalid format = error
    if(!email || !validator.isEmail(email)) {
        throw new Error('Invalid email');
    }
}

exports.validPassword = (password) => {
    if(!password || !validator.isLength(password, { min: 8 })) {
        throw new Error('Password must be at least 8 characters');
    }
}