// app.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const config = require('./config/config');

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ storage });

// Middleware
app.use(express.json());

// Routes
const imageRoutes = require('./routes/imageRoutes.js');
app.use('/api/images', upload.single('image'), imageRoutes);

const IP = '172.16.0.94';
const PORT = 9001;
app.listen(PORT, IP, () => {
  console.log(`Server is running on port http://${IP}:${PORT}`);
});
