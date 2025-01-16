const User = require("../models/user");


function handleUserSigninPage(req, res) {
    return res.render('signin', {
        user: req.user,
    });
}


function handleUserSignupPage(req, res) {
    return res.render('signup', {
        user: req.user,
    });
}


async function handleUserSignin(req, res) {
    const { email, password } = req.body;

    // Step 1: Validate the request body
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    // Step 2: Check the password and get the session token if password is correct
    try {
        const session_token = await User.matchPasswordAndGenerateSessionToken(email, password);

        return res.cookie('token', session_token).redirect('/');

    } catch (error) {
        return res.render('signin', {
            user: req.user,
            error: `Error signing in: ${error.message}`
        });
    }
}


async function handleUserSignup(req, res) {
    const { fullName, email, password } = req.body;

    // Step 1: Validate the request body
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: 'Full name, email and password are required',
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
    const user = await User.create({
        fullName,
        email,
        password
    });

    if (!user) {
        return res.status(400).json({
            message: 'Error creating user',
        });
    }

    return res.status(201).redirect('/');
}


function handleUserSignOut(req, res) {
    return res.clearCookie('token').redirect('/');
}


module.exports = {
    handleUserSigninPage,
    handleUserSignupPage,
    handleUserSignin,
    handleUserSignup,
    handleUserSignOut,
};
