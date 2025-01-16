const dotenv = require('dotenv');
const e = require('express');
const jwt = require('jsonwebtoken');


dotenv.config();


function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    return token;
}


function validateToken(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};
