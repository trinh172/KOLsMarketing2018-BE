const express = require('express');
const router = express.Router();
const mess = require('../controller/message.controller');

router.post('/open-room',mess.openRoom);
router.post('/get-all-message-in-room',mess.getRoomMessage);
router.post('/get-all-room',mess.getAllRoom);
module.exports = router;