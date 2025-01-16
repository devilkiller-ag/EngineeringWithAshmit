const Blog = require("../models/blog");


function handleCreateNewBlogPage(req, res) {
    return res.render('createBlog', {
        user: req.user,
    });
}


async function handleCreateNewBlog(req, res) {
    const { title, body } = req.body;
    const coverImageURL = `/uploads/${req.file.filename}`;

    const blog = await Blog.create({
        title,
        body,
        coverImageURL,
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


module.exports = {
    handleCreateNewBlogPage,
    handleCreateNewBlog,
};
