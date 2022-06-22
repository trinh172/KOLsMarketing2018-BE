const express = require('express');
const router = express.Router();
const social = require('../controller/social.controller');
const statistic = require('../controller/statistic.controller');
const auth_middle = require('../middleware/auth_middleware');

//routes for statistic of kols
router.post('/count-like-share-all-post-of-kol-in-job', auth_middle.isLogin, statistic.count_like_comment_in_job);
router.post('/count-publish-and-draft-post', auth_middle.isLogin, statistic.count_social_draft_post_of_1_kol);
router.post('/count-job-of-kol', auth_middle.isLogin, statistic.count_job_of_kol);
router.post('/count-brand-like-kol', auth_middle.isKOLs, statistic.number_brand_like_kol); //số lượng brand đã theo dõi mình
router.post('/count-brand-kol-like', auth_middle.isKOLs, statistic.number_brand_kol_like); // số lượng brand mà mình theo dõi

//routes for statistic of brands
//router.post('/count-like-share-per-job', auth_middle.isBrand, social.count_like_comment_in_job);
//router.post('/count-social-post-for-each-job', auth_middle.isBrand, social.count_like_comment_in_job);

router.post('/count-post-of-brand-per-month', auth_middle.isBrand, statistic.count_all_post_of_brand_per_month);
router.post('/count-like-share-cmt-per-post', auth_middle.isBrand, statistic.count_like_share_cmt_per_post);
router.post('/count-kol-work-with-brand', auth_middle.isBrand, statistic.count_kol_work_with_brand);
router.post('/count-recruitment-of-brand', auth_middle.isBrand, statistic.count_recruit_of_brand);

router.post('/count-kol-like-brand', auth_middle.isBrand, statistic.number_kol_like_brand); //số lượng kol đã theo dõi mình (brand)
router.post('/count-kol-brand-like', auth_middle.isBrand, statistic.number_kol_brand_like); // số lượng kol mà mình theo dõi
module.exports = router;