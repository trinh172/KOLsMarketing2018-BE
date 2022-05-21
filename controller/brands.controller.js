const brands_db = require('../model/brands.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment');
var shuffle = function(array, n) {
    temp = [];
    originalLength = array.length;
    for (var i = 0; i < n; i++) {
      temp.push(array.splice(Math.floor(Math.random()*array.length),1));
    }
    return temp;
 };
exports.brands_profile_detail = async function(req, res) {
    //Get infor from form at FE 
    let flag = await brands_db.getBrandsProfile(req.jwtDecoded.data.id);
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}
exports.get15Brands = async function(req, res) {
    let flag = await brands_db.getListBrands();
    if (flag){
        if(flag.length <= 15)
            return res.status(200).json(flag);
        let result = await shuffle(flag, 15);
        return res.status(200).json(result);
    }
    
    return res.status(400).json(null);
}

exports.get60Brands = async function(req, res) {
    let flag = await brands_db.getListBrands();
    if (flag){
        if(flag.length <= 60)
            return res.status(200).json(flag);
        let result = await shuffle(flag, 60);
        return res.status(200).json(result);
    }
    
    return res.status(400).json(null);
}

exports.edit_fullname = async function(req, res) {
    //Get infor from form at FE 
    let new_fullname = req.body.fullname;
    let flag = await brands_db.updateFullname(new_fullname, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_fullname);
    }
    
    return res.status(400).json(false);
}

exports.edit_brandname = async function(req, res) {
    //Get infor from form at FE 
    let new_brandname = req.body.brandname;
    let flag = await brands_db.updateBrandname(new_brandname, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_brandname);
    }
    
    return res.status(400).json(false);
}

exports.edit_description = async function(req, res) {
    //Get infor from form at FE 
    let new_des = req.body.describe;
    let flag = await brands_db.updateIntroduce(new_des, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_des);
    }
    
    return res.status(400).json(false);
}

exports.edit_password = async function(req, res) {
    //Get infor from form at FE 
    const hash = bcrypt.hashSync(req.body.password, 10);
    let flag = await brands_db.updatePassword(req.jwtDecoded.data.id, hash);
    if (flag){
        return res.status(200).json("Đổi mật khẩu thành công");
    }
    
    return res.status(400).json(false);
}

exports.edit_email = async function(req, res) {
    let new_email = req.body.mail;
    //Check duplicate email
    let check_dup_email = await brands_db.findBrandsByEmail(new_email);
    if(check_dup_email.id != req.jwtDecoded.data.id){
        return res.status(400).json("Email không khả dụng");
    }
    let flag = await brands_db.updateEmail(new_email, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_email);
    }
    
    return res.status(400).json(false);
}

exports.edit_phone = async function(req, res) {
    //Get infor from form at FE 
    let new_phone = req.body.phone;
    let flag = await brands_db.updatePhone(new_phone, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_phone);
    }
    
    return res.status(400).json(false);
}

exports.edit_address = async function(req, res) {
    //Get infor from form at FE 
    let new_address = req.body.phone;
    let flag = await brands_db.updateAddress(new_address, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_address);
    }
    
    return res.status(400).json(false);
}

exports.update_avatar = async function(req, res) {
    //Get infor from form at FE 
    let new_avatar = req.body.avatar;
    let flag = await brands_db.updateAvatar(new_avatar, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_avatar);
    }
    
    return res.status(400).json(false);
}

exports.update_cover = async function(req, res) {
    //Get infor from form at FE 
    let new_cover = req.body.cover;
    let flag = await brands_db.updateCover(new_cover, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(new_cover);
    }
    
    return res.status(400).json(false);
}

exports.update_bio_link = async function(req, res) {
    //Get infor from form at FE 
    let array_bio = req.body.bio_link;
    let flag = await brands_db.updateBioLink(array_bio, req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(array_bio);
    }
    
    return res.status(400).json(false);
}