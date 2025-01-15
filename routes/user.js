const express = require('express');

const {
    handleUserSigninPage,
    handleUserSignupPage,
    handleUserSignin,
    handleUserSignup,
} = require('../controllers/user');


const router = express.Router();


router.get('/signin', handleUserSigninPage);

router.get('/signup', handleUserSignupPage);

router.post('/signin', handleUserSignin);

router.post('/signup', handleUserSignup);


module.exports = router;
