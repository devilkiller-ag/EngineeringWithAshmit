const express = require('express');

const {
    handleUserSigninPage,
    handleUserSignupPage,
    handleUserSignin,
    handleUserSignup,
    handleUserSignOut,
    handleDisplayUserDashboard,
    handleEditUserProfilePage,
    handleEditUserProfile,
} = require('../controllers/user');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/signin', handleUserSigninPage);

router.get('/signup', handleUserSignupPage);

router.post('/signin', handleUserSignin);

router.post('/signup', handleUserSignup);

router.get('/signout', handleUserSignOut);

router.get('/dashboard/:id', handleDisplayUserDashboard);

router.get('/edit', handleEditUserProfilePage);

router.patch('/:id', upload.single('profileImage'), handleEditUserProfile);

module.exports = router;
