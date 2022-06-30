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
router.post('/updateotp',  auth_middle.isAdmin, admin.updateotp);

router.get('/get-list-post-of-1cate/:id', auth_middle.isAdmin, admin.get_list_post_of_1cate);
router.post('/edit-category-name', auth_middle.isAdmin, admin.update_cate_name);
router.post('/add-new-category', auth_middle.isAdmin, admin.add_new_cate);  

router.post('/get-all-post', auth_middle.isAdmin, admin.get_all_post); 
router.post('/block-post', auth_middle.isAdmin, admin.block_post); 
router.post('/unblock-post', auth_middle.isAdmin, admin.unblock_post); 
module.exports = router;