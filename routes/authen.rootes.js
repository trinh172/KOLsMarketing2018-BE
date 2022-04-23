const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.controller');
const brands_db = require('../controller/brands.controller');

router.post('/is-available',authentication.is_available);
router.post('/is-available-email',authentication.is_available_email);
//router.patch('/check-otp', authentication.check_otp);
router.post('/register-kols',authentication.kols_register);
router.post('/register-brands',authentication.brands_register);
//router.patch('/get-otp', authentication.get_otp);
//router.patch('/renew-password', authentication.change_password);
router.post('/kols-login', authentication.kols_signin);
router.post('/brands-login', authentication.brands_signin);
router.post('/google-login', authentication.google_signin);

router.get('/list-brands', brands_db.get15Brands);
router.get('/list-brands-more', brands_db.get60Brands);
module.exports = router;