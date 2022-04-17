const express = require('express');
const router = express.Router();
const mess = require('../controller/message.controller');

router.get('/open-room',mess.openRoom);
router.get('/get-all-message-in-room',mess.getRoomMessage);
module.exports = router;