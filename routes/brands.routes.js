const express = require('express');
const router = express.Router();
const brands = require('../controller/brands.controller');

router.get('/get-profile',brands.brands_profile_detail);
module.exports = router;