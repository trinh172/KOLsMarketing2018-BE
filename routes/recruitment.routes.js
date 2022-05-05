const express = require('express');
const router = express.Router();
const recruit = require('../controller/recruitment.controller');
const path = require('path');
const auth_middle = require('../middleware/auth_middleware');

router.post('/create-recruitment', auth_middle.isKOLs, recruit.add_recruitment);
router.delete('/delete-recruitment', auth_middle.isKOLs, recruit.delete_recruitment);
router.post('/find-recruitment-of-post', auth_middle.isBrand, recruit.find_recruitments_in_post);

router.post('/accept-recruitment-of-post', auth_middle.isBrand, recruit.accept_recruitment);
router.post('/reject-recruitment-of-post', auth_middle.isBrand, recruit.reject_recruitment);
module.exports = router;