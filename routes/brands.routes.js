const express = require('express');
const router = express.Router();
const brands = require('../controller/brands.controller');
const posts = require('./posts.routes');

router.get('/get-profile',brands.brands_profile_detail);
router.use('/post', posts);

module.exports = router;