import dotenv from "dotenv";
dotenv.config();

const envs = {
  cloudinaryUrl: process.env.CLOUDINARY_URL,
};

export default envs;