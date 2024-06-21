import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

// Function to generate a unique filename based on timestamp and random string
const generateUniqueFilename = (originalFilename) => {
  const timestamp = new Date().getTime(); // Current timestamp
  const randomString = Math.random().toString(36).substring(7); // Random string

  if (!originalFilename) {
    return `${timestamp}_${randomString}.jpg`; // Default filename if original filename is not available
  }

  const extension = path.extname(originalFilename); // Extract extension from original filename
  const basename = path.basename(originalFilename, extension); // Extract basename (without extension)

  return `${basename}_${timestamp}_${randomString}${extension}`; // Construct unique filename
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Initialize IncomingForm with configuration options
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public/uploads'), // Define upload directory
      keepExtensions: true, // Keep file extensions
    });

    try {
      // Parse incoming form data
      const formData = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          console.log('Parsed Form Data:', { fields, files }); // Debugging: Log parsed form data
          resolve({ fields, files });
        });
      });

      // Ensure that 'image' file exists in formData.files
    const directoryPath = path.join(process.cwd(), 'public/uploads'); // Path to the uploads directory

    try {
      // Read all files in the directory
      const files = await fs.promises.readdir(directoryPath);

      if (!files || files.length === 0) {
        return res.status(404).json({ error: 'No files found in the directory' });
      }

      // Sort files by modified time in descending order to get the latest file
      const sortedFiles = files.sort((a, b) => {
        const statA = fs.statSync(path.join(directoryPath, a));
        const statB = fs.statSync(path.join(directoryPath, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
      });

      // Get the latest file name
      const latestFileName = sortedFiles[0];

      // Return the latest file name in JSON response
     
      const imageUrl = `/uploads/${latestFileName}`;
      return res.status(200).json({ message: 'Berhasil', imageUrl:imageUrl });
    } catch (error) {
      console.error('Error reading directory:', error);
      return res.status(500).json({ error: 'Failed to read directory', message: error.message });
    }
      
    } catch (error) {
      console.error('Kesalahan saat memproses form:', error);
      return res.status(500).json({ message: 'Gagal memproses data form', error: error.message });
    }
  } else {
    // If request method is not POST, return a JSON response with a 405 status code (Method Not Allowed)
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }
}

