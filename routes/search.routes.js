const express = require('express');
const router = express.Router();
const search = require('../controller/search.controller')

router.get('/homepage',search.search_categories);
module.exports = router;