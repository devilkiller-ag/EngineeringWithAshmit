const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: `/images/avatars/avatar_${Math.floor((Math.random() * 6) + 1)}.png`,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, { timestamps: true });


userSchema.pre('save', function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a random salt
    const salt = randomBytes(16).toString();

    // Hash the password using the salt
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashPassword;

    next();
});


const User = mongoose.model('User', userSchema);


module.exports = User;
