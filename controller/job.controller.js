const brands_db = require('../model/brands.model');
const job_db = require('../model/job.model');
const post_db = require('../model/posts.model');
const noti_db = require('../model/nofitications.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');

exports.add_job_describe = async function(req, res) {
    console.log("Check job image already upload: ", req.body.files);
    let list_images = req.body.files;
    //Get infor from form at FE 
    let create_time = moment().add(7, 'hours');
    let new_job = {
        content: req.body.content,
        id_post: req.body.id_post,
        id_brand: req.jwtDecoded.data.id,
        create_time: create_time
    };
    let flag = await job_db.create_job_describe(new_job);
    
    let added_job = await job_db.findJobByBrandCreatetime(req.jwtDecoded.data.id, create_time);
    if (added_job){
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
                        "message": `${req.jwtDecoded.data.full_name} đã thêm một yêu cầu công việc mới!`,
                        "create_time":  moment().add(7, 'hours'),
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
    console.log("Check comment image already upload: ", req.body.files);
    //Get infor from form at FE 
    let create_time = moment().add(7, 'hours');
    let new_cmt = {
        content: req.body.content,
        id_post: req.body.id_post,
        id_user: req.jwtDecoded.data.id,
        role: req.jwtDecoded.role,
        create_time: create_time,
        url: req.body.files
    };
    let flag = await job_db.create_job_comment(new_cmt);
    
    let added_job = await job_db.findCommentByUserCreatetime(req.jwtDecoded.data.id,req.jwtDecoded.data.role, create_time);
    if (added_job){
        if (req.jwtDecoded.data?.role == '1'){
            let post_info = await post_db.findPostByIDNotDetail(req.body?.id_post);
            if(post_info?.id_writer){
                //Tạo notification thông báo cho brand biết là có người khác comment
                let new_noti = {
                    "id_user": post_info?.id_writer,
                    "role": '2',
                    "id_post": req.body.id_post, 
                    "message": `${req.jwtDecoded.data.full_name} đã bình luận trong công việc của bạn!`,
                    "create_time":  moment().add(7, 'hours'),
                    "status": '0',
                }
                let add_noti = await noti_db.createNotification(new_noti);
            }
        }
        return res.status(200).json(added_job);
    }
    res.status(400).json(null);
}

exports.find_job_in_post = async function(req, res) {
    let list_job = await job_db.findJobByPostID(req.body.id_post);
    if (list_job){
        const sortedActivities = list_job.sort((a, b) => b.create_time - a.create_time)
        return res.status(200).json(sortedActivities);
    }
    res.status(400).json(null);
}

exports.find_cmt_in_post = async function(req, res) {
    let list_cmt = await job_db.findCommentByPostID(req.body.id_post);
    if (list_cmt){
        const sortedActivities = list_cmt.sort((a, b) => b.create_time - a.create_time)
        return res.status(200).json(sortedActivities);
    }
    res.status(400).json(null);
}

exports.find_member_in_post = async function(req, res) {
    let list_member = await job_db.findMemberByPostID(req.body.id_post);
    if (list_member){
        const sortedActivities = list_member.sort((a, b) => b.state - a.state)
        return res.status(200).json(sortedActivities);
    }
    res.status(400).json(null);
}

exports.accept_kols_work_done = async function(req, res) {
    let flag = await job_db.markDoneJob(req.body.id_post, req.body.id_kol);
    if (flag){
        return res.status(200).json(true);
    }
    res.status(400).json(false);
}

exports.reject_kols_work_done = async function(req, res) {
    let flag = await job_db.markNotDoneJob(req.body.id_post, req.body.id_kol);
    if (flag){
        return res.status(200).json(true);
    }
    res.status(400).json(false);
}

exports.delete_job = async function(req, res) {
    let id_job = req.body.id_job;
    let flag = await job_db.delete_job(id_job)
    if (flag){
        return res.status(200).json(true);
    }
    
    return res.status(400).json(false);
}