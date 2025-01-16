const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');


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
    // This function is used to hash the password before saving the user to the database.

    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a random salt
    const salt = randomBytes(16).toString();

    // Hash the password using the salt
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    // Override the user salt and password with the new salt and hashed password
    this.salt = salt;
    this.password = hashPassword;

    next();
});


userSchema.static('matchPasswordAndGenerateSessionToken', async function (email, password) {
    // This function is used to compare the password provided by the user with the hashed password stored in the database.

    // Find the user by email
    const user = await this.findOne({ email });

    // Check if the user exists
    if (!user) throw new Error('User not found');

    // Retrieve the salt and hashed password of the user
    const salt = user.salt;
    const hashedPassword = user.password;

    // Hash the password to be checked using the salt
    const userProvidedPasswordHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    // Compare the hashed password with the hash of user provided password and return the session token if they match
    if (hashedPassword === userProvidedPasswordHash) {
        const session_token = createTokenForUser(user);
        return session_token;
    } else {
        throw new Error('Invalid password');
    }
});


const User = mongoose.model('User', userSchema);


module.exports = User;
