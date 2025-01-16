const { marked } = require('marked');

const Blog = require("../models/blog");
const Comment = require('../models/comment');
const { formatDateStandard, formatDateWithOrdinal, formatDateAbbreviated } = require("../services/format_date");


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

    // Fetch blog comments
    const comments = await Comment.find({ blogId: blog._id }).populate('createdBy');

    // For the related blogs section
    const allUserBlogs = await Blog.find({ createdBy: blog.createdBy._id });
    const relatedBlogs = allUserBlogs.filter((b) => b._id.toString() !== blog._id.toString());

    return res.render('blog', {
        user: req.user,
        blog,
        comments,
        relatedBlogs,
        marked,
        formatDateStandard,
        formatDateWithOrdinal,
        formatDateAbbreviated,
    });
}


async function handlePostComment(req, res) {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });

    if (!comment) {
        return res.render(`/blog/${req.params.blogId}`, {
            user: req.user,
            error: 'Failed to create blog',
        });
    }

    res.redirect(`/blog/${req.params.blogId}`);
}


module.exports = {
    handleCreateNewBlogPage,
    handleCreateNewBlog,
    handleDisplayBlog,
    handlePostComment,
};
