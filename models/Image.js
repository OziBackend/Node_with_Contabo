// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  tag: String,
  imagePath: String,
  folderName: String
});

module.exports = mongoose.model('Image', imageSchema);
