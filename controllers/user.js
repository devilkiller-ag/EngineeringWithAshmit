const fs = require('fs');
const path = require('path');

const User = require("../models/user");
const Blog = require("../models/blog");
const { uploadFileOnCloudinary, deleteFileFromCloudinary } = require('../services/cloudinary');
const DEFAULT_PROFILE_IMAGES = require('../lib/default_profile_images');


function handleUserSigninPage(req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  return res.render('signin', {
    user: req.user,
  });
}


function handleUserSignupPage(req, res) {
  if (req.user) {
    return res.redirect('/');
  }

  return res.render('signup', {
    user: req.user,
  });
}


async function handleUserSignin(req, res) {
  const { email, password } = req.body;

  // Step 1: Validate the request body
  if ([email, password].some((field) => field?.trim() === '')) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  // Step 2: Check the password and get the session token if password is correct
  try {
    const session_token = await User.matchPasswordAndGenerateSessionToken(email, password);

    return res.cookie('token', session_token).redirect('/');

  } catch (error) {
    return res.render('signin', {
      user: req.user,
      error: `Error signing in: ${error.message}`
    });
  }
}


async function handleUserSignup(req, res) {
  const { fullName, email, password } = req.body;

  // Step 1: Validate the request body
  if ([fullName, email, password].some((field) => field?.trim() === '')) {
    return res.status(400).json({
      message: 'Full name, email and password are required',
    });
  }

  // Step 2: Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists',
    });
  }

  // Step 3: Create a new user
  const user = await User.create({
    fullName,
    email,
    password
  });

  if (!user) {
    return res.status(400).json({
      message: 'Error creating user',
    });
  }

  return res.status(201).redirect('/');
}


function handleUserSignOut(req, res) {
  return res.clearCookie('token').redirect('/');
}


async function handleDisplayUserDashboard(req, res) {
  const authorId = req.params.id;
  const author = await User.findById(authorId);

  const authorBlogs = await Blog.find({ createdBy: authorId }).sort({ createdAt: -1 });

  return res.render('dashboard', {
    user: req.user,
    author,
    authorBlogs,
  });
}


async function handleEditUserProfilePage(req, res) {
  if (!req.user) {
    return res.redirect('/user/signin');
  }

  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return res.redirect('/user/signin');
  }

  return res.render('editUser', {
    user,
  });
}


async function handleEditUserProfile(req, res) {
  if (!req.user) {
    return res.redirect('/user/signin');
  }

  const userId = req.user._id;
  const { fullName, email } = req.body;

  if ([fullName, email].some((field) => field?.trim() === '')) {
    return res.status(400).json({
      message: 'Full name and email are required',
    });
  }

  // Initialize an update object
  const updateData = { fullName, email };

  try {
    // Find the existing user by ID to get the current profile image URL
    const existingUser = await User.findById(userId);

    // If the user doesn't exist, return an error
    if (!existingUser) {
      return res.status(404).redirect('/', {
        message: 'User not found',
      });
    }

    // If a new profile image is uploaded, delete the old cover image file
    if (req.file) {
      const profileImageLocalPath = req.file.path;

      const profileImage = await uploadFileOnCloudinary(profileImageLocalPath, 'engineering_with_ashmit/profile_images');

      if (!profileImage) {
        return res.status(500).redirect(`/user/dashboard/${userId}`);
      }

      // Delete the local file
      if (fs.existsSync(profileImageLocalPath)) {
        fs.unlinkSync(profileImageLocalPath);
      }

      // Delete the old profile image from Cloudinary
      if (!DEFAULT_PROFILE_IMAGES.includes(existingUser.profileImageURL)) {
        await deleteFileFromCloudinary(existingUser.profileImageURL);
      }

      updateData.profileImageURL = profileImage.secure_url;
    }

    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // If the update is successful, redirect to the updated blog's detail page
    return res.redirect(`/user/dashboard/${userId}`);
  } catch (error) {
    console.error('Error updating blog:', error);

    return res.status(500).redirect(`/user/dashboard/${userId}`);
  }

}


module.exports = {
  handleUserSigninPage,
  handleUserSignupPage,
  handleUserSignin,
  handleUserSignup,
  handleUserSignOut,
  handleDisplayUserDashboard,
  handleEditUserProfilePage,
  handleEditUserProfile,
};
