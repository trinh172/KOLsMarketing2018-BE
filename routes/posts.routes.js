const express = require('express');
const router = express.Router();
const posts = require('../controller/posts.controller');
const path = require('path');

var multer  = require('multer');
const fs = require('fs');

//Init const for save image
const storage = multer.diskStorage({
  // Định nghĩa nơi file upload sẽ được lưu lại
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/images/posts/'));
  },
  filename: (req, file, callback) => {
    // Edit file name
    // Only allow upload png and jgeg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }

    // Add label time to make filename not duplicate
    let filename = `${new Date().getTime()}-${Math.random()}.jpg`;
    callback(null, filename);
  }
});

// .array() truyền vào name của thẻ input, ở đây mình đặt là "many-files", max images is 10
const uploadManyFiles = multer({storage: storage});

router.post('/create-post', uploadManyFiles.array("files", 10),posts.add_post);
router.post('/delete-post/:id',posts.delete_post);
router.get('/get-post-in-month',posts.findPostInMonthHomepage);
router.get('/get-top-post',posts.findTop9PostHomepage);
router.get('/get-new-post-by-cate',posts.findNewPostByCateHomepage);
router.post('/is-available-title', posts.checkAvailableTittle);
router.post('/get-detail-post/:id', posts.getDetailPost);
router.post('/check-formdata', posts.add_post);
module.exports = router;