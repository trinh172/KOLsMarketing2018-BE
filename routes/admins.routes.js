const express = require('express');
const router = express.Router();
const admin = require('../controller/admins.controller');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-kols-detail/:id', auth_middle.isAdmin, admin.kols_profile_detail);
router.get('/get-brands-detail/:id', auth_middle.isAdmin, admin.brands_profile_detail);
router.get('/get-admin-detail/:id', auth_middle.isAdmin, admin.admins_profile_detail);

router.get('/get-list-brands', auth_middle.isAdmin, admin.get_list_brands);
router.get('/get-list-kols', auth_middle.isAdmin, admin.get_list_kols);
router.get('/get-list-admins', auth_middle.isAdmin, admin.get_list_admins);
router.post('/updateotp',  auth_middle.isAdmin, admin.updateotp)
module.exports = router;