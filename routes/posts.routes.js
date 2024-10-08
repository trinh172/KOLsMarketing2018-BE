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

router.post('/kol-get-active-post-of-brand', posts.kolGetAllActivePostOfBrand);
router.post('/kol-get-2active-post-of-brand', posts.kolGet2ActivePostOfBrand);

router.get('/get-active-post-of-brand',  auth_middle.isBrand, posts.getAllActivePostOfBrand);
router.get('/get-unactive-post-of-brand', auth_middle.isBrand, posts.getAllUnactivePostOfBrand);

router.post('/get-suggest-post', posts.get12SuggestPost);
router.post('/get-suggest-post-more', posts.getAllSuggestPost);
router.post('/get-suggest-post-not-dup-save-recruit', auth_middle.isKOLs, posts.getSuggestNotDupSaveRecruitPost);

router.get('/get-post-user-recruitment', auth_middle.isKOLs, posts.getAllPostKolsRecruitment);

router.post('/is-available-title', posts.checkAvailableTittle);
router.post('/get-detail-post/:id', posts.getDetailPost);
router.post('/check-formdata', posts.add_post);

router.patch('/unactive-post', auth_middle.isBrand, posts.unactivePost);
router.patch('/active-post', auth_middle.isBrand, posts.activePost);
module.exports = router;