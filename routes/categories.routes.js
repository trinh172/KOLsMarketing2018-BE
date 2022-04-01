const express = require('express');
const router = express.Router();
const cate = require('../controller/categories.controller')

router.get('/all-cate',cate.getListCategories);
module.exports = router;