const express = require('express');
const router = express.Router();
const job = require('../controller/job.controller');
const path = require('path');
const auth_middle = require('../middleware/auth_middleware');

router.post('/create-job', auth_middle.isBrand, job.add_job_describe);
router.delete('/delete-job', auth_middle.isKOLs, job.delete_job);
router.post('/find-job-of-post', auth_middle.isLogin, job.find_job_in_post);

router.post('/create-comment', auth_middle.isLogin, job.add_job_comment);
router.post('/find-comment-of-post', auth_middle.isLogin, job.find_cmt_in_post);

router.post('/mark-kol-done-job', auth_middle.isBrand, job.accept_kols_work_done);
router.post('/mark-kol-not-done-job', auth_middle.isBrand, job.reject_kols_work_done);

router.post('/get-all-member-of-post', auth_middle.isLogin, job.find_member_in_post);
router.delete('/delete-member-of-post', auth_middle.isBrand, job.delete_member_of_post);
router.post('/join-job-by-email', auth_middle.isKOLs, job.join_job_by_email);
router.post('/send-invite-job', auth_middle.isBrand, job.send_invite_mail);

router.get('/get-all-post-of-brand',  auth_middle.isBrand, job.getAllPostOfBrand);
router.get('/get-all-job-of-kol',  auth_middle.isKOLs, job.getAllJobOfKOL);
module.exports = router;