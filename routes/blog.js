const multer = require('multer');
const express = require('express');

const {
    handleDisplayBlog,
    handlePostComment,
    handleCreateNewBlog,
    handleCreateNewBlogPage,
    handleEditBlogPage,
    handleEditBlog,
    handleDeleteBlog,
} = require('../controllers/blog');


const blog_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/blog_images`);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: blog_storage });


const router = express.Router();

router.get('/create-new', handleCreateNewBlogPage);

router.post('/comment/:blogId', handlePostComment);

router.get('/edit/:id', handleEditBlogPage);

router.get('/delete/:id', handleDeleteBlog);

router.get('/:id', handleDisplayBlog);

router.patch('/:id', upload.single('coverImage'), handleEditBlog);

router.post('/', upload.single('coverImage'), handleCreateNewBlog);


module.exports = router;
