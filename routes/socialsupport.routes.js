const express = require('express');
const router = express.Router();
const social = require('../controller/social.controller');
const auth_middle = require('../middleware/auth_middleware');

router.post('/get-user-info', auth_middle.isKOLs, social.get_user_social_info);
router.post('/get-1page-info', auth_middle.isKOLs, social.save_user_info);
router.post('/get-list-page-info', auth_middle.isKOLs, social.get_list_page_of_kol);
router.post('/get-list-draft-of-kol', auth_middle.isKOLs, social.get_list_draft_of_kol);
router.post('/get-list-publish-post-done-of-kol', auth_middle.isKOLs, social.get_list_publish_post_done);
router.post('/get-list-publish-post-wait-of-kol', auth_middle.isKOLs, social.get_list_publish_post_waiting);
router.post('/get-count-like-comment-share-of-post', auth_middle.isLogin, social.count_like_comment);

router.post('/validate-user', auth_middle.isKOLs, social.save_user_info);
router.post('/validate-page', auth_middle.isKOLs, social.save_page_info);
router.post('/save-user-info', auth_middle.isKOLs, social.save_user_info);

router.post('/post-social-immediately', auth_middle.isKOLs, social.post_status_immediately);
router.post('/post-social-schedule', auth_middle.isKOLs, social.post_schedule);
router.post('/post-video-immediately', auth_middle.isKOLs, social.post_video);

router.post('/create-draft-post', auth_middle.isKOLs, social.create_draft);
router.post('/publish-a-draft-post-immediately', auth_middle.isKOLs, social.publish_draft_immediately);
router.post('/publish-a-draft-post-schedule', auth_middle.isKOLs, social.publish_draft_schedule);

router.post('/update-draft-post', auth_middle.isKOLs, social.update_draft);
router.delete('/delete-a-post', auth_middle.isKOLs, social.delete_post);
router.post('/logout-social', auth_middle.isKOLs, social.logout_fb);
router.post('/get-list-draft-of-1kol-in-post', auth_middle.isKOLs, social.get_list_draft_of_1kol_in_post);

//routes for brand to manage social post in post_job
//route lấy các bài đăng của kols trong công việc lớn, phải truyền id_post
router.post('/get-list-draft-of-post', auth_middle.isBrand, social.get_list_draft_of_post);
router.post('/get-list-publish-post-done-of-post', auth_middle.isBrand, social.get_list_done_of_post);
router.post('/get-list-publish-post-schedule-of-post', auth_middle.isBrand, social.get_list_schedule_of_post);

//route lấy các bài đăng của kols trong nhiệm vụ, phải truyền id_job
router.post('/get-list-draft-of-job', auth_middle.isBrand, social.get_list_draft_of_job);
router.post('/get-list-publish-post-done-of-job', auth_middle.isBrand, social.get_list_done_of_job);
router.post('/get-list-publish-post-schedule-of-job', auth_middle.isBrand, social.get_list_schedule_of_job);

router.post('/accept-draft-post', auth_middle.isBrand, social.accept_draft_post);
router.post('/reject-draft-post', auth_middle.isBrand, social.reject_draft_post);
module.exports = router;