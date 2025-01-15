const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');


const userSchema = new Schema({
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
        required: true,
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

    if (!user.isModified('password')) return next();

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashPassword;

    next();
})


const User = model('User', userSchema);


module.exports = User;
