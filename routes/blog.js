const path = require('path');
const multer = require('multer');
const express = require('express');

const {
    handleDisplayBlog,
    handlePostComment,
    handleCreateNewBlog,
    handleCreateNewBlogPage,
    handleEditBlogPage,
    handleEditBlog,
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

router.post('/comment/:blogId', handlePostComment);

router.get('/:id', handleDisplayBlog);

router.get('/edit/:id', handleEditBlogPage);

router.patch('/:id', upload.single('coverImage'), handleEditBlog);

router.post('/', upload.single('coverImage'), handleCreateNewBlog);


module.exports = router;
