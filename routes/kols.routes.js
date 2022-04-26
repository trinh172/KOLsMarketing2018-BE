const express = require('express');
const router = express.Router();
const kols = require('../controller/kols.controller');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-profile',auth_middle.isKOLs, kols.kols_profile_detail);
module.exports = router;