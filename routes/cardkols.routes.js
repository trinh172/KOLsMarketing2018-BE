const express = require('express');
const router = express.Router();
const cardkols = require('../controller/cardkols.controller');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-detail-card',auth_middle.isKOLs, cardkols.get_detail_card);
router.post('/update-detail-card',auth_middle.isKOLs, cardkols.update_card);
router.post('/update-state-publish',auth_middle.isKOLs, cardkols.update_state_publish);
router.get('/get-all-card', cardkols.get_all_card);
module.exports = router;