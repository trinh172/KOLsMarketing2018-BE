const brands_db = require('../model/brands.model');
const job_db = require('../model/job.model');
const post_db = require('../model/posts.model');
const noti_db = require('../model/nofitications.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');
const nodemailer = require('nodemailer');
const contentMail = require('./mailContent.controller')
const config = require('../config/const.config');

exports.add_job_describe = async function(req, res) {
    console.log("Check job image already upload: ", req.body?.files);
    let list_images = req.body?.files;
    //Get infor from form at FE 
    let create_time = moment().add(7, 'hours');
    let new_job = {
        content: req.body?.content,
        id_post: req.body?.id_post,
        type: req.body?.type,
        id_brand: req.jwtDecoded.data.id,
        create_time: create_time
    };
    let flag = await job_db.create_job_describe(new_job);
    let getUserInfo = {};
    getUserInfo.email = req.jwtDecoded.data.email;
    getUserInfo.name = req.jwtDecoded.data.brand_name;
    getUserInfo.id = req.jwtDecoded.data.id;
    getUserInfo.role = req.jwtDecoded.data.role;
    getUserInfo.avatar = req.jwtDecoded.data.avatar;
    let added_job = await job_db.findJobByBrandCreatetime(req.jwtDecoded.data.id, create_time);
    let post_detail = await post_db.findPostByIDNotDetail(req.body.id_post);
    if (added_job){
        added_job.userInfo = getUserInfo;
        added_job.image = list_images;
        //lưu các ảnh của user up lên trong job
        for (index = 0; index < list_images.length; index++){
            let new_image = {
                id_job: added_job.id,
                url: list_images[index],
                type: '1'
            }
            await job_db.create_job_image(new_image);
        }

        let post_member = await job_db.findMemberByPostID(req.body?.id_post);
        if(post_member.length > 0){
            //Tạo notification thông báo cho member biết là brand tạo job_describe mới
            for(i = 0; i < post_member.length; i++){
                if(post_member[i].role == '1'){
                    let new_noti = {
                        "id_user": post_member[i].id_user,
                        "role": '1',
                        "id_post": req.body.id_post, 
                        "id_job_describe": added_job?.id,
                        "message": `đã thêm một yêu cầu công việc mới`,
                        "create_time":  moment().add(7, 'hours'),
                        "avatar": req.jwtDecoded.data.avatar,
                        "name": req.jwtDecoded.data.brand_name,
                        "post_title": post_detail?.title,
                        "status": '0',
                    }
                    await noti_db.createNotification(new_noti);
                }
            }
        }
        return res.status(200).json(added_job);
    }
    res.status(400).json(null);
}

exports.add_job_comment = async function(req, res) {
    console.log("Check comment image already upload: ", req.body.files, req.body?.id_post);
    //Get infor from form at FE 
    let create_time = moment().add(7, 'hours');
    let new_cmt = {
        content: req.body?.content,
        id_job: req.body?.id_job,
        id_user: req.jwtDecoded.data.id,
        role: req.jwtDecoded.data.role,
        create_time: create_time,
        url: req.body.files
    };
    let getUserInfo = {};
    getUserInfo.email = req.jwtDecoded.data.email;
    if (req.jwtDecoded.data.role == '1'){
        getUserInfo.name = req.jwtDecoded.data.full_name;
    }
    else{
        getUserInfo.name = req.jwtDecoded.data.brand_name;
    }
    getUserInfo.id = req.jwtDecoded.data.id;
    getUserInfo.role = req.jwtDecoded.data.role;
    getUserInfo.avatar = req.jwtDecoded.data.avatar;
    let flag = await job_db.create_job_comment(new_cmt);
    if (flag){
        new_cmt.userInfo = getUserInfo;
        if (req.jwtDecoded.data?.role == '1'){
            let post_info = await post_db.findPostByIDNotDetail(req.body?.id_post);
            if(post_info?.id_writer){
                //Tạo notification thông báo cho brand biết là có người khác comment
                let new_noti = {
                    "id_user": post_info?.id_writer,
                    "role": '2',
                    "id_post": req.body?.id_post, 
                    "id_job_describe": req.body?.id_job,
                    "message": `đã bình luận trong công việc của bạn!`,
                    "create_time":  moment().add(7, 'hours'),
                    "avatar": req.jwtDecoded.data.avatar,
                    "name": req.jwtDecoded.data.full_name,
                    "post_title": post_info?.title,
                    "status": '0',
                }
                let add_noti = await noti_db.createNotification(new_noti);
            }
        }
        return res.status(200).json(new_cmt);
    }
    else{
        return res.status(400).json(new_cmt);
    }
    
}

exports.find_job_in_post = async function(req, res) {
    let list_job = await job_db.findJobByPostID(req.body.id_post);
    if (list_job){
        //const sortedActivities = list_job.sort((a, b) => b.create_time - a.create_time)
        return res.status(200).json(list_job);
    }
    else{
        return res.status(400).json([]);
    }
    
}

exports.find_cmt_in_job = async function(req, res) {
    let list_cmt = await job_db.findCommentByJobID(req.body?.id_job);
    if (list_cmt){
        //const sortedActivities = list_cmt.sort((a, b) => a.create_time - b.create_time)
        return res.status(200).json(list_cmt);
    }
    else{
        return res.status(400).json([]);
    }
}

exports.find_member_in_post = async function(req, res) {
    let list_member = await job_db.findMemberByPostID(req.body.id_post);
    if (list_member){
        const sortedActivities = list_member.sort((a, b) => b.state - a.state)
        return res.status(200).json(sortedActivities);
    }
    else{
        return res.status(400).json([]);
    }
}

exports.accept_kols_work_done = async function(req, res) {
    let flag = await job_db.markDoneJob(req.body.id_post, req.body.id_kol);
    if (flag){
        return res.status(200).json(true);
    }
    else{
        return res.status(400).json(false);
    }
}

exports.reject_kols_work_done = async function(req, res) {
    let flag = await job_db.markNotDoneJob(req.body.id_post, req.body.id_kol);
    if (flag){
        return res.status(200).json(true);
    }
    else{
        return res.status(400).json(false);
    }
}

exports.delete_job = async function(req, res) {
    let id_job = req.body.id_job;
    let flag = await job_db.delete_job(id_job)
    if (flag){
        return res.status(200).json(true);
    }
    else{
        return res.status(400).json(false);
    }
}

exports.delete_member_of_post = async function(req, res) {
    let id_post = req.body.id_post;
    let id_kol = req.body.id_kol;
    let flag = await job_db.delete_member(id_post, id_kol, 1)
    if (flag){
        return res.status(200).json(true);
    }
    
    return res.status(400).json(false);
}

exports.join_job_by_email = async function(req, res) {
    let id_post = req.body.id_post;
    let title = decodeURI(req.body.linkcode);
    
    let job = await post_db.findPostByIDNotDetail(id_post);
    if (job && title == job.title){
        
        //Xử lý job (member)
        let new_mem = {
            'id_post': id_post,
            'id_user': req.jwtDecoded.data.id,
            'role': 1,
            'state': 1,
            'create_time':  moment().add(7, 'hours')
        }
        let flag = await job_db.create_job_member(new_mem);
        return res.status(200).json(flag)
    }
    else{
        return res.status(404).json(false)
    }
}

exports.send_invite_mail = async function(req, res) {
    let id_post = req.body.id_post;
    let email = req.body.email;

    let job = await post_db.findPostByIDNotDetail(id_post);
    if (job){
        let link_invite = config.DOMAIN_FE + "invitejob/" + id_post + "/" + encodeURI(job.title);
        console.log("invite link: ", link_invite);
        let content = await contentMail.getInvitationMail(req.jwtDecoded.data.full_name, email, link_invite, job.title);
        console.log(typeof(content));
        let transporter = nodemailer.createTransport(
            {
                service: "hotmail",
                auth: {
                  user: 'kolsmarketing@hotmail.com',
                  pass: 'Thangtrinh@kols18'
                },
        });
        
        var mailOptions={
            from: "kolsmarketing@hotmail.com",
            to: email,
            subject: "Thư mời tham gia công việc",
            html: content,
        };
         
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Sent email error: ", error);
                return res.json(false);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return res.status(200).json(true)
        });

    }
    else{
        return res.status(404).json(false)
    }
}


exports.generate_link = async function(req, res) {
    let id_post = req.body.id_post;

    let job = await post_db.findPostByIDNotDetail(id_post);
    if (job){
        let link_invite = config.DOMAIN_FE + "invitejob/" + id_post + "/" + encodeURI(job.title);
        console.log("join job link: ", link_invite);
        return res.status(200).json(link_invite)
    }
    else{
        return res.status(404).json('');
    }
}

exports.checkIsExistKolsInJob = async function(req, res) {
    let flag = await job_db.checkExistKolInJob(req.jwtDecoded.data.id, req.body?.id_post);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json(false);
}

exports.getAllPostOfBrand = async function(req, res) {
    let flag = await job_db.findAllPostOfBrand(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json(false);
}

exports.getAllJobOfKOL = async function(req, res) {
    let flag = await job_db.findAllJobOfKOL(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json(false);
}