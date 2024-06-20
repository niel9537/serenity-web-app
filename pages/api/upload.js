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
      const file = formData.files?.image;
      
      if (!file) {
        return res.status(400).json({ error: 'No files received or "image" field is missing.' });
      }

      // Generate unique filename based on original filename or use default name
      const filename = file.originalFilename ? file.originalFilename.replace(/\s+/g, '_') : 'file_tidak_bernama';
      const newFilename = generateUniqueFilename(filename); // Generate unique filename

      const newPath = path.join(form.uploadDir, newFilename); // Ensure form.uploadDir is correctly set
      
      // Log the paths for debugging
      console.log('New Path:', newPath);

      try {
        // Check if newFilename is defined and a string
        if (typeof newFilename !== 'string') {
          throw new Error('Generated filename is not valid');
        }

        // Check if file.filepath is defined and valid
        if (!file.filepath || typeof file.filepath !== 'string') {
          throw new Error('File path is undefined or not a string');
        }

        // Move file to new path
        fs.renameSync(file.filepath, newPath);

        // Return a JSON response with success message and status code 200, including imageUrl
        const imageUrl = `/uploads/${newFilename}`;
        return res.status(200).json({ message: 'Berhasil', imageUrl });
      } catch (error) {
        console.error('Kesalahan saat memindahkan file:', error);
        return res.status(500).json({ message: 'Gagal memindahkan file', error: error.message });
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
