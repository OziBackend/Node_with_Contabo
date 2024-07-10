// controllers/imageController.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const Image = require('../models/Image');

const s3 = new AWS.S3({
  accessKeyId: config.contabo.accessKeyId,
  secretAccessKey: config.contabo.secretAccessKey,
  region: config.contabo.region,
  endpoint: config.contabo.endpoint,
  s3ForcePathStyle: true, // Add this line if using a custom endpoint

});

exports.uploadImage = async (req, res) => {
  const { tag, folderName } = req.body;
  const imageFile = req.file;

  // Create folder if it doesn't exist
  const folderKey = `${folderName}/`;
  const params = {
    Bucket: config.contabo.bucketName,
    Key: folderKey
  };

  s3.headObject(params, async (err, data) => {
    //   console.log('0', err);
    if (err && err.code === 'NotFound') {
        console.log('1');
        // Folder does not exist, create it
        s3.putObject(params, (err) => {
          console.log('2');
          if (err) {
            console.log('3');
          return res.status(500).json({ error: 'Error creating folder in Contabo bucket' });
        }
      });
    }
    
    // Upload image
    const imageKey = `${folderName}/${imageFile.originalname}`;
    const uploadParams = {
      Bucket: config.contabo.bucketName,
      Key: imageKey,
      Body: fs.createReadStream(imageFile.path)
    };

    s3.upload(uploadParams, async (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading image to Contabo bucket' });
      }

      // Save image info in MongoDB
      const newImage = new Image({
        tag,
        imagePath: data.Location.replace('.com/','.com/f14811957fd44c59815deb96f13f1388:'),
        folderName
      });

      await newImage.save();

      res.status(200).json({ message: 'Image uploaded successfully', data: newImage });
    });
  });
};
