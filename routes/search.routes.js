const express = require('express');
const router = express.Router();
const search = require('../controller/search.controller')

router.post('/homepage',search.search_categories_address);
module.exports = router;