const fs = require('fs');
const { marked } = require('marked');

const Blog = require("../models/blog");
const Comment = require('../models/comment');
const { uploadFileOnCloudinary, deleteFileFromCloudinary } = require('../services/cloudinary');
const { formatDateStandard, formatDateWithOrdinal, formatDateAbbreviated } = require("../services/format_date");


function handleCreateNewBlogPage(req, res) {
  return res.render('createBlog', {
    user: req.user,
  });
}


async function handleCreateNewBlog(req, res) {
  const { title, description, body } = req.body;
  const coverImageLocalPath = req.file.path;

  if ([title, description, body].some((field) => field?.trim() === '')) {
    return res.render('createBlog', {
      user: req.user,
      error: 'All fields are required',
    });
  }

  // Upload the cover image to Cloudinary
  const blogCoverImage = await uploadFileOnCloudinary(coverImageLocalPath, 'engineering_with_ashmit/blog_cover_images');

  if (!blogCoverImage) {
    return res.render('createBlog', {
      user: req.user,
      error: 'Failed to create blog',
    });
  }

  if (fs.existsSync(coverImageLocalPath)) {
    fs.unlinkSync(coverImageLocalPath); // Delete the local file
  }

  // Create a new blog
  const coverImageURL = blogCoverImage.secure_url;
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


async function handleEditBlogPage(req, res) {
  const id = req.params.id;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.render(`/`, {
      user: req.user,
      error: 'Blog not found',
    });
  }

  return res.render('editBlog', {
    user: req.user,
    blog,
  });
}


async function handleEditBlog(req, res) {
  const { id } = req.params; // Get the blog ID from the route parameter
  const { title, description, body } = req.body; // Extract updated fields from the request body

  // Validate the fields
  if ([title, description, body].some((field) => field?.trim() === '')) {
    return res.render('editBlog', {
      user: req.user,
      error: 'All fields are required',
      blog: {
        _id: id,
        title,
        description,
        body,
      },
    });
  }

  // Initialize an update object
  const updateData = { title, description, body };

  try {
    // Find the existing blog by ID to get the current cover image URL
    const existingBlog = await Blog.findById(id);

    // If the blog doesn't exist, return an error
    if (!existingBlog) {
      return res.status(404).render('editBlog', {
        user: req.user,
        error: 'Blog not found',
        blog: null, // Ensure the blog object is still defined
      });
    }

    // If a new cover image is uploaded, delete the old cover image file
    if (req.file) {
      const coverImageLocalPath = req.file.path;

      const blogCoverImage = await uploadFileOnCloudinary(coverImageLocalPath, 'engineering_with_ashmit/blog_cover_images');

      if (!blogCoverImage) {
        return res.status(500).redirect(`/blog/${id}`);
      }

      // Delete the local file
      if (fs.existsSync(coverImageLocalPath)) {
        fs.unlinkSync(coverImageLocalPath);
      }

      // Delete the old profile image from Cloudinary
      if (existingBlog.coverImageURL) {
        await deleteFileFromCloudinary(existingBlog.coverImageURL);
      }

      updateData.coverImageURL = blogCoverImage.secure_url;
    }

    // Update the blog with the new data
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    // If the update is successful, redirect to the updated blog's detail page
    return res.redirect(`/blog/${updatedBlog._id}`);
  } catch (error) {
    // Handle errors and render the edit page with the existing blog details and error message
    console.error('Error updating blog:', error);

    // Retrieve the existing blog for rendering the edit page
    const blog = await Blog.findById(id);

    return res.status(500).render('editBlog', {
      user: req.user,
      error: 'Failed to update blog. Please try again later.',
      blog: {
        _id: id,
        title,
        description,
        body,
      },
    });
  }
}


async function handleDeleteBlog(req, res) {
  const id = req.params.id;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).render('editBlog', {
        user: req.user,
        error: 'Blog not found',
        blog: null,
      });
    }

    return res.redirect('/');
  } catch (error) {
    return res.status(500).redirect(`/blog/${id}`);
  }
}


async function handlePostComment(req, res) {
  const { content } = req.body;

  if (!content.trim()) {
    return res.redirect(`/blog/${req.params.blogId}`);
  }

  const comment = await Comment.create({
    content: content,
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


async function handleDeleteComment(req, res) {
  const id = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    const blogId = deletedComment.blogId;

    if (!deletedComment) {
      return res.status(404).redirect(`/blog/${blogId}`, {
        user: req.user,
        error: 'Blog not found',
        blog: null,
      });
    }

    return res.redirect(`/blog/${blogId}`);
  } catch (error) {
    return res.status(500).redirect(`/}`);
  }
}


module.exports = {
  handleCreateNewBlogPage,
  handleCreateNewBlog,
  handleDisplayBlog,
  handleEditBlogPage,
  handleEditBlog,
  handleDeleteBlog,
  handlePostComment,
  handleDeleteComment,
};
