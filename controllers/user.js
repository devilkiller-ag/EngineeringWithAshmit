const User = require("../models/user");


function handleUserSigninPage(req, res) {
    return res.render('signin');
}


function handleUserSignupPage(req, res) {
    return res.render('signup');
}


function handleUserSignin(req, res) {
    return res.redirect('/signin');
}


async function handleUserSignup(req, res) {
    const { fullName, email, password } = req.body;

    // Step 1: Validate the request body
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    // Step 2: Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists',
        });
    }

    // Step 3: Create a new user
    const user = await User.create(
        fullName,
        email,
        password
    );

    if (!user) {
        return res.status(400).json({
            message: 'Error creating user',
        });
    }

    return res.status(201).redirect('/');
}


module.exports = {
    handleUserSigninPage,
    handleUserSignupPage,
    handleUserSignin,
    handleUserSignup,
};
