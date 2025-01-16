const { marked } = require('marked');
const Blog = require("../models/blog");

function handleCreateNewBlogPage(req, res) {
    return res.render('createBlog', {
        user: req.user,
    });
}


async function handleCreateNewBlog(req, res) {
    const { title, description, body } = req.body;
    const coverImageURL = `/uploads/${req.file.filename}`;

    const blog = await Blog.create({
        title,
        body,
        coverImageURL,
        description,
        createdBy: req.user._id,
    });


    if (!blog) {
        return res.render('createBlog', {
            user: req.user,
            error: 'Failed to create blog',
        });
    }

    return res.redirect(`/blog/${blog._id}`);
}


async function handleDisplayBlog(req, res) {
    const id = req.params.id;

    const blog = await Blog.findById(id).populate('createdBy');

    if (!blog) {
        return res.redirect('/');
    }

    // For the related blogs section
    const allUserBlogs = await Blog.find({ createdBy: blog.createdBy._id });

    return res.render('blog', {
        user: req.user,
        blog,
        allUserBlogs,
        marked,
    });
}


module.exports = {
    handleCreateNewBlogPage,
    handleCreateNewBlog,
    handleDisplayBlog,
};
