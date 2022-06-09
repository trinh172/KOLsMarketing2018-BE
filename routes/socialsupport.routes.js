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
router.post('/get-count-like-comment-share-of-post', auth_middle.isKOLs, social.count_like_comment);
router.post('/get-statistic-all-post-of-kol-in-job', auth_middle.isLogin, social.count_like_comment_in_job);

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
module.exports = router;