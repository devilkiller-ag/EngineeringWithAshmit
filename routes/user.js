const express = require('express');

const {
    handleUserSigninPage,
    handleUserSignupPage,
    handleUserSignin,
    handleUserSignup,
    handleUserSignOut,
} = require('../controllers/user');


const router = express.Router();


router.get('/signin', handleUserSigninPage);

router.get('/signup', handleUserSignupPage);

router.post('/signin', handleUserSignin);

router.post('/signup', handleUserSignup);

router.get('/signout', handleUserSignOut);

module.exports = router;
