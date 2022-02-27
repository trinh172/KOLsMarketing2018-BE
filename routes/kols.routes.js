const express = require('express');
const router = express.Router();
const kols = require('../controller/kols.controller');

router.get('/get-profile',kols.kols_profile_detail);
module.exports = router;