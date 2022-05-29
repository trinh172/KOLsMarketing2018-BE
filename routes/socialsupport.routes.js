const express = require('express');
const router = express.Router();
const social = require('../controller/social.controller')

router.post('/get-user-info',social.get_user_social_info);
router.post('/get-1page-info',social.save_user_info);
router.post('/get-list-page-info',social.get_list_page_of_kol);
router.post('/get-list-draft-of-kol',social.get_list_draft_of_kol);

router.post('/validate-user',social.save_user_info);
router.post('/validate-page',social.save_page_info);
router.post('/save-user-info',social.save_user_info);

router.post('/post-social-immediately',social.post_status_immediately);
router.post('/post-social-schedule',social.post_schedule);
router.post('/create-draft-post',social.create_draft);
router.post('/publish-a-draft-post-immediately',social.publish_draft_immediately);
router.post('/publish-a-draft-post-schedule',social.publish_draft_schedule);
module.exports = router;