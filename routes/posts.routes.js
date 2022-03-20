const express = require('express');
const router = express.Router();
const posts = require('../controller/posts.controller')

router.post('/create-post', posts.add_post);
router.post('/delete-post/:id',posts.delete_post);
router.get('/get-post-in-month',posts.findPostInMonthHomepage);
router.get('/get-top-post',posts.findTop9PostHomepage);
router.get('/get-new-post-by-cate',posts.findNewPostByCateHomepage);
module.exports = router;