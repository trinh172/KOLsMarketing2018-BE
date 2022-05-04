const kols_db = require('../model/kols.model')
const brands_db = require('../model/brands.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


exports.kols_profile_detail = async function(req, res) {
    //Get infor from form at FE 
    let flag = await kols_db.getKOLsProfile(req.jwtDecoded.data.id);
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}

exports.edit_fullname = async function(req, res) {
    //Get infor from form at FE 
    let new_fullname = req.body.fullname;
    let flag = await kols_db.updateFullname(new_fullname, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_fullname);
    }
    
    return res.status(400).json(false);
}

exports.edit_description = async function(req, res) {
    //Get infor from form at FE 
    let new_des = req.body.describe;
    let flag = await kols_db.updateDescription(new_des, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_des);
    }
    
    return res.status(400).json(false);
}

exports.edit_password = async function(req, res) {
    //Get infor from form at FE 
    const hash = bcrypt.hashSync(req.body.password, 10);
    let flag = await kols_db.updatePassword(req.jwtDecoded.data.id, hash);
    if (flag){
        return res.status(200).json("Đổi mật khẩu thành công");
    }
    
    return res.status(400).json(false);
}

exports.edit_info = async function(req, res) {
    //Get infor from form at FE 
    let check_dup_email = await kols_db.findKOLsByEmail(req.body.mail);
    if(check_dup_email.id != req.jwtDecoded.data.id){
        return res.status(400).json("Email không khả dụng");
    }
    let new_info = {
        birth: req.body.birth,
        gender: req.body.gender,
        phone: req.body.phone,
        mail: req.body.mail,
        address: req.body.address
    }
    let flag = await kols_db.updateInfo(new_info, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_des);
    }
    
    return res.status(400).json(false);
}

exports.update_avatar = async function(req, res) {
    //Get infor from form at FE 
    let new_avatar = req.body.avatar;
    let flag = await kols_db.updateAvatar(new_avatar, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_avatar);
    }
    
    return res.status(400).json(false);
}

exports.update_detail_images = async function(req, res) {
    //Get infor from form at FE 
    let array_images = req.body.detail_images;
    let flag = await kols_db.updateImageDetail(array_images, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(array_images);
    }
    
    return res.status(400).json(false);
}

exports.add_bio_link = async function(req, res) {
    //Get infor from form at FE 
    let bio_url = req.body.bio;
    let flag = await kols_db.addBioUrl(bio_url, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(bio_url);
    }
    
    return res.status(400).json(false);
}
exports.delete_bio_link = async function(req, res) {
    //Get infor from form at FE 
    let bio_url = req.body.bio_delete;
    let flag = await kols_db.deleteBioUrl(bio_url, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json("Xóa bio link thành công!");
    }
    
    return res.status(400).json(false);
}