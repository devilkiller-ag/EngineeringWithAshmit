const express = require('express');

const {
    handleDisplayBlog,
    handleCreateNewBlog,
    handleCreateNewBlogPage,
    handleEditBlogPage,
    handleEditBlog,
    handleDeleteBlog,
    handlePostComment,
    handleDeleteComment,
} = require('../controllers/blog');
const upload = require('../middlewares/multer');


const router = express.Router();

router.get('/create-new', handleCreateNewBlogPage);

router.get('/comment/delete/:id', handleDeleteComment);

router.post('/comment/:blogId', handlePostComment);

router.get('/edit/:id', handleEditBlogPage);

router.get('/delete/:id', handleDeleteBlog);

router.get('/:id', handleDisplayBlog);

router.patch('/:id', upload.single('coverImage'), handleEditBlog);

router.post('/', upload.single('coverImage'), handleCreateNewBlog);


module.exports = router;
