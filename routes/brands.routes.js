const express = require('express');
const router = express.Router();
const brands = require('../controller/brands.controller');
const posts = require('./posts.routes');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-profile', auth_middle.isBrand,brands.brands_profile_detail);

module.exports = router;