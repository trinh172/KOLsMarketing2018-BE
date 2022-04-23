const express = require('express');
const router = express.Router();
const posts = require('../controller/posts.controller');
const path = require('path');
const auth_middle = require('../middleware/auth_middleware');

router.post('/create-post', auth_middle.isBrand, posts.add_post);
router.post('/delete-post/:id',auth_middle.isBrand, posts.delete_post);
router.get('/get-post-in-month',posts.findPostInMonthHomepage);
router.get('/get-top-post',posts.findTop9PostHomepage);

router.get('/get-new-post-by-cate/:id_cate',posts.findNewPostByCateHomepage);
router.get('/get-new-post-by-cate-more/:id_cate',posts.findNewPostByCateMore);

router.get('/get-newest-post',posts.find60NewestPost);
router.get('/get-newest-post-more',posts.find120NewestPost);

router.get('/get-high-cast-post',posts.findHighestCastPost);
router.get('/get-high-cast-post-more',posts.findHighestCastPostMore);

router.post('/like-post', auth_middle.isKOLs, posts.kolsLikePost);
router.get('/get-post-user-like', auth_middle.isKOLs, posts.getAllPostKolsLikes);
router.delete('/unlike-post', auth_middle.isKOLs, posts.kolsUnlikePost);

router.get('/get-post-user-recruitment', auth_middle.isKOLs, posts.getAllPostKolsRecruitment);

router.post('/is-available-title', posts.checkAvailableTittle);
router.post('/get-detail-post/:id', posts.getDetailPost);
router.post('/check-formdata', posts.add_post);
module.exports = router;