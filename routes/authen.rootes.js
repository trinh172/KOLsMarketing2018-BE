const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.controller');
const brands_ct = require('../controller/brands.controller');
const address_ct = require('../controller/address.controller');

router.post('/is-available',authentication.is_available);
router.post('/is-available-email',authentication.is_available_email);

router.post('/register-kols',authentication.kols_register);
router.post('/register-brands',authentication.brands_register);

router.patch('/get-otp', authentication.get_otp);
router.patch('/check-otp-kols', authentication.check_otp_kol);
router.patch('/check-otp-brands', authentication.check_otp_brand);
router.patch('/renew-password-brands', authentication.change_password_brands);
router.patch('/renew-password-kols', authentication.change_password_kols);

router.post('/kols-login', authentication.kols_signin);
router.post('/brands-login', authentication.brands_signin);
router.post('/google-login', authentication.google_signin);

router.get('/list-province-vn', address_ct.list_province_vn);

module.exports = router;