const express = require('express');
const router = express.Router();
const posts = require('../controller/posts.controller')

router.post('/create-post', posts.add_post);
router.post('/delete-post/:id',posts.delete_post);

module.exports = router;