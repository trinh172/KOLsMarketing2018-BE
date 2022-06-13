const brands_db = require('../model/brands.model');
const recruit_db = require('../model/recruitments.model')
const job_db = require('../model/job.model');
const noti_db = require('../model/nofitications.model');
const post_db = require('../model/posts.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');

exports.add_recruitment = async function(req, res) {
    console.log("Check many-images already upload: ", req.body.files);
    //Get infor from form at FE 
    let create_time = moment().add(7, 'hours');

    //Tạo recruit mới
    let new_recruit = {
        content: req.body.content,
        id_post: req.body.id_post,
        id_kols: req.jwtDecoded.data.id,
        id_brands: req.body.id_brands,
        url: req.body.files,
        create_time: create_time
    };
    let flag = await recruit_db.create_recruitment(new_recruit)
    let post_detail = await post_db.findPostByIDNotDetail(req.body.id_post);
    //Tạo notification thông báo cho brand có người mới recruit
    let new_noti = {
        "id_user": req.body.id_brands,
        "role": '2',
        "id_post": req.body.id_post, 
        "message": `đã ứng tuyển cho bài đăng`,
        "avatar": req.jwtDecoded.data.avatar,
        "name": req.jwtDecoded.data.full_name,
        "post_title": post_detail?.title,
        "create_time":  moment().add(7, 'hours'),
	    "status": '0',
    }
    let add_noti = await noti_db.createNotification(new_noti);
    let added_recruit = await recruit_db.findRecruitmentBykolscreatetime(req.jwtDecoded.data.id, create_time);
    if (added_recruit){
        return res.status(200).json(added_recruit);
    }
    res.status(400).json(null);
}

exports.find_recruitments_in_post = async function(req, res) {
    let list_recruit = await recruit_db.findRecruitmentByPostID(req.body.id_post);
    if (list_recruit){
        return res.status(200).json(list_recruit);
    }
    res.status(400).json(null);
}
exports.accept_recruitment = async function(req, res) {
    let flag = await recruit_db.acceptRecruitment(req.body.id_recruit);
   
    if (flag){
        let post_detail = await post_db.findPostByIDNotDetail(flag.id_post);
        //Tạo notification thông báo cho kol là đã được duyệt ứng tuyển
        let new_noti = {
            "id_user": flag.id_kols,
            "role": '1',
            "id_post": flag.id_post, 
            "message": `đã đồng ý ứng tuyển của bạn`,
            "avatar": req.jwtDecoded.data.avatar,
            "name": req.jwtDecoded.data.brand_name,
            "post_title": post_detail?.title,
            "create_time":  moment().add(7, 'hours'),
            "status": '0',
        }
        let add_noti = await noti_db.createNotification(new_noti);
        let new_mem = {
            'id_post':flag.id_post,
            'id_user': flag.id_kols,
            'role': 1,
            'state': 1,
            'create_time':  moment().add(7, 'hours')
        }
        await job_db.create_job_member(new_mem)
        return res.status(200).json(true);
    }
    res.status(400).json(false);
}

exports.reject_recruitment = async function(req, res) {
    let flag = await recruit_db.rejectRecruitment(req.body.id_recruit);
    if (flag){
        return res.status(200).json(true);
    }
    res.status(400).json(false);
}

exports.delete_recruitment = async function(req, res) {
    let id_recruitment = req.body.id_recruit;
    let del_recruit =  await recruit_db.findRecruitmentByRecruitID(id_recruitment);
    let flag = await recruit_db.delete_recruitment(id_recruitment)
    if (flag){
        await job_db.delete_member(del_recruit.id_post, req.jwtDecoded.data.id, req.jwtDecoded.data.role);
        return res.status(200).json(true);
    }
    
    return res.status(400).json(false);
}