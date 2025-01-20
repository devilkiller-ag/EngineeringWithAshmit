const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;


// Configuration
cloudinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (localFilePath, upload_folder_path) => {
  try {
    if (!localFilePath) {
      // console.log('CLOUDINARY UPLOAD ERROR: Local file path is required');
      return null;
    }

    // Upload the image
    const uploadResult = await cloudinary.uploader
      .upload(localFilePath, {
        folder: upload_folder_path,
        resource_type: 'auto',
      });

    // console.log('Successfully uploaded the file to cloudinary: ', uploadResult);

    return uploadResult;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation has got failed
    fs.unlinkSync(localFilePath);

    return null;
  }
}


const deleteFileFromCloudinary = async (url) => {
  try {
    const urlParts = new URL(url);
    const filePath = urlParts.pathname.split('/');
    const publicIdWithExtension = filePath.slice(5).join('/');
    const publicId = publicIdWithExtension.replace(path.extname(publicIdWithExtension), ''); // Remove the extension

    const deleteResult = await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log('ERROR: ', error);
    return null;
  }
};


module.exports = {
  uploadFileOnCloudinary,
  deleteFileFromCloudinary,
};
