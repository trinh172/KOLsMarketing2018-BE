const express = require('express');
const router = express.Router();
const brands = require('../controller/brands.controller');
const posts = require('./posts.routes');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-profile', auth_middle.isBrand,brands.brands_profile_detail);
router.post('/edit-fullname',auth_middle.isBrand, brands.edit_fullname);
router.post('/edit-brandname',auth_middle.isBrand, brands.edit_brandname);
router.post('/edit-address',auth_middle.isBrand, brands.edit_address);
router.post('/edit-email',auth_middle.isBrand, brands.edit_email);
router.post('/edit-phone',auth_middle.isBrand, brands.edit_phone);
router.post('/edit-description',auth_middle.isBrand, brands.edit_description);

router.post('/update-avatar',auth_middle.isBrand, brands.update_avatar);
router.post('/update-cover',auth_middle.isBrand, brands.update_cover);
router.post('/update-bio-link',auth_middle.isBrand, brands.update_bio_link);

router.patch('/renew-password',auth_middle.isBrand, brands.edit_password);

router.post('/brand-info', brands.kol_get_brand_info);
router.get('/list-brands', brands.get15Brands);
router.get('/list-brands-more', brands.get60Brands);

module.exports = router;