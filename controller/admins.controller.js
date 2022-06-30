const kols_db = require('../model/kols.model')
const brands_db = require('../model/brands.model');
const admins_db = require('../model/admins.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment');
const { all } = require('../model/kols.model');
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.kols_profile_detail = async function(req, res) {
    const id_user = req.params.id;
    
    let flag = await kols_db.getKOLsProfile(id_user);
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(404).json(false);
}

exports.brands_profile_detail = async function(req, res) {
    const id_user = req.params.id;
    
    let flag = await brands_db.getBrandsProfileAndCountPost(id_user);
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(404).json(false);
}

exports.admins_profile_detail = async function(req, res) {
    const id_user = req.params.id;
    
    let flag = await admins_db.getAdminsProfile(id_user);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(404).json(false);
}

exports.get_list_brands = async function(req, res) {
    //Get infor from form at FE 
    let flag = await brands_db.all();
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}

exports.get_list_admins = async function(req, res) {
    //Get infor from form at FE 
    let flag = await admins_db.all();
    let is_super = false;
    if(req.jwtDecoded.data.is_super == 1){
        is_super = true;
    }
    if (flag){
        return res.json({
            list_admin: flag,
            is_super: is_super,
        });
    }
    
    return res.status(400).json([]);
}
exports.get_list_kols = async function(req, res) {
    //Get infor from form at FE 
    let flag = await kols_db.all();
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}

exports.updateotp = async function(req, res) {
    const id_user = req.body.id;
    const role = req.body.role;
    const newotp = req.body.otp;
    if(role == 1){
        const kol = await kols_db.updateOTPByIDKOLs(id_user, newotp);
        return res.status(200).json(kol);
    }
    if(role == 2){
        const brand = await brands_db.updateOTPByIDBrands(id_user, newotp);
        return res.status(200).json(brand);
    }
    return res.status(400).json(false);
}

exports.get_list_post_of_1cate = async function(req, res) {
    const id_cate = req.params.id;
    const list_post = await admins_db.getListPostByCategory(id_cate);
    return res.status(200).json(list_post);
}
exports.get_all_cate = async function(req, res) {
    const list_cate = await admins_db.getAllCate();
    return res.status(200).json(list_cate);
}
exports.update_cate_name = async function(req, res) {
    const id_cate = req.body.id_cate;
    const cate_name = req.body.cate_name;
    const update_name = await admins_db.updateCategoryName(id_cate, cate_name);
    if (update_name){
        return res.status(200).json(update_name);
    }
    return res.status(400).json(false);
}

exports.add_new_cate = async function(req, res) {
    const cate_name = req.body.cate_name;
    const add_cate = await admins_db.addNewCate(cate_name);
    if (add_cate){
        let all_cate = await admins_db.getAllCate();
        return res.status(200).json(all_cate);
    }
    return res.status(400).json(false);
}

exports.get_all_post = async function(req, res) {
    const list_post = await admins_db.getAllPost();
    return res.status(200).json(list_post);
}

exports.block_post = async function(req, res) {
    const id_post = req.body.id_post;
    const result = await admins_db.updateStatusOfPost(id_post, '0');
    return res.status(200).json(result);
}

exports.unblock_post = async function(req, res) {
    const id_post = req.body.id_post;
    const result = await admins_db.updateStatusOfPost(id_post, '1');
    return res.status(200).json(result);
}

exports.set_hot_post = async function(req, res) {
    const id_post = req.body.id_post;
    const result = await admins_db.updateHotOfPost(id_post, '1');
    return res.status(200).json(result);
}

exports.set_not_hot_post = async function(req, res) {
    const id_post = req.body.id_post;
    const result = await admins_db.updateHotOfPost(id_post, '0');
    return res.status(200).json(result);
}