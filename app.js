const express = require('express');
const app = express();
const multer = require('multer'); // For handling file uploads
const mysql = require('mysql'); // MySQL library

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  database: 'mysql',
  user: 'root',
  password: '123456',
});

// Configure multer for handling file uploads
const upload = multer();

// Handle POST requests to /upload_stamps
app.post('/upload_stamps', upload.array('stampImages'), (req, res) => {
  const stampImages = req.files; // The uploaded stamp images as an array of buffers

  // Insert the stamp image data into the database
  const insertQueries = stampImages.map(image => (
    new Promise((resolve, reject) => {
      pool.query('INSERT INTO stamp_images (data) VALUES (?)', [image.buffer], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    })
  ));

  Promise.all(insertQueries)
    .then(() => {
      res.json({ message: 'Stamp images uploaded successfully.' });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error uploading stamp images to database.' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
