const path = require('path');
const multer = require('multer');
const express = require('express');

const {
    handleCreateNewBlogPage,
    handleCreateNewBlog,
} = require('../controllers/blog');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/`);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


const router = express.Router();


router.get('/create-new', handleCreateNewBlogPage);

router.post('/', upload.single('coverImage'), handleCreateNewBlog);


module.exports = router;
