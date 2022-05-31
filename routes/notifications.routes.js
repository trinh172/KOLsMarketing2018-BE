const express = require('express');
const router = express.Router();
const noti = require('../controller/notification.controller')
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-all-noti', auth_middle.isLogin, noti.getAllNotificationsOf1User);
router.post('/mark-read-1noti', auth_middle.isLogin, noti.mark1NotiRead);
module.exports = router;