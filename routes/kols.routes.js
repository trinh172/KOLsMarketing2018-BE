const express = require('express');
const router = express.Router();
const kols = require('../controller/kols.controller');
const auth_middle = require('../middleware/auth_middleware');

router.get('/get-profile',auth_middle.isKOLs, kols.kols_profile_detail);
router.post('/edit-fullname',auth_middle.isKOLs, kols.edit_fullname);
router.post('/update-avatar',auth_middle.isKOLs, kols.update_avatar);

router.post('/edit-description',auth_middle.isKOLs, kols.edit_description);

router.post('/update-detail-images',auth_middle.isKOLs, kols.update_detail_images);

router.post('/add-bio-link',auth_middle.isKOLs, kols.add_bio_link);
router.delete('/delete-bio-link',auth_middle.isKOLs, kols.delete_bio_link);
router.post('/update-bio-link',auth_middle.isKOLs, kols.update_bio_link);

router.post('/edit-info',auth_middle.isKOLs, kols.edit_info);

router.patch('/renew-password',auth_middle.isKOLs, kols.edit_password);

router.post('/like-brand', auth_middle.isKOLs, kols.kolsLikeBrand);
router.get('/get-brand-user-like', auth_middle.isKOLs, kols.getAllBrandsKolsLikes);
router.delete('/unlike-brand', auth_middle.isKOLs, kols.kolsUnlikeBrand);

router.post('/kol-info', kols.brand_get_kol_info);
module.exports = router;