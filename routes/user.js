const multer = require('multer');
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


const profile_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/profile_images`);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: profile_storage });


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
