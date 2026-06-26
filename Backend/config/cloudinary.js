import { v2 as cloudinary } from 'cloudinary'

import fs from 'fs'

const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary