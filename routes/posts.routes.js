const express = require('express');
const router = express.Router();
const posts = require('../controller/posts.controller')

var multer  = require('multer');
const fs = require('fs');

//upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/posts/`);
    },
    filename: function (req, file, cb) {
      cb(null, `${new Date().getTime()}-${Math.random()}.jpg`);
    }
})   
const upload = multer({ storage: storage });

router.post('/create-post', upload.single('cover'),posts.add_post);
router.post('/delete-post/:id',posts.delete_post);
router.get('/get-post-in-month',posts.findPostInMonthHomepage);
router.get('/get-top-post',posts.findTop9PostHomepage);
router.get('/get-new-post-by-cate',posts.findNewPostByCateHomepage);
router.post('/is-available-title', posts.checkAvailableTittle);

module.exports = router;