const express = require('express');
const router = express.Router();
const authentication = require('../controller/authentication.controller');

router.post('/is-available',authentication.is_available);
router.get('/is-available-email',authentication.is_available_email);
//router.patch('/check-otp', authentication.check_otp);
router.post('/register-kols',authentication.kols_register);
router.post('/register-brands',authentication.brands_register);
//router.patch('/get-otp', authentication.get_otp);
//router.patch('/renew-password', authentication.change_password);
router.post('/kols-login', authentication.kols_signin);
router.post('/brands-login', authentication.brands_signin);
//router.post('/google-login', authentication.google_signin);
module.exports = router;