const express = require('express');
const router = express.Router();
const search = require('../controller/search.controller')

router.get('/by-address',search.search_address);
router.get('/by-categories',search.search_categories);
module.exports = router;