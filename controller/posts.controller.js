const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const categories_db = require('../model/categories.model');
const image_db = require('../model/images.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment');

exports.add_post = async function(req, res) {
    //Get infor from form at FE 
    let new_post = {};
    let flag = await post_db.createPosts(new_post);
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}
exports.delete_post = async function(req, res) {
    let post_id = req.body.id_post;
    let flag = await post_db.delete_post(post_id);
    if (flag){
        return res.json(true);
    }
    
    return res.json(false);
}

exports.findTop9PostHomepage = async function(req, res) {
    
    let flag = await post_db.findTop9MostRead();
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}

exports.findPostInMonthHomepage = async function(req, res) {
    
    let flag = await post_db.findPostInMonth();
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}
exports.findNewPostByCateHomepage = async function(req, res) {
    let idCate = req.body.id_cate;
    if(idCate){
        let flag = await post_db.findNewPostByCategory(idCate);
        if (flag){
            return res.json(flag);
        }
    }
    
    return res.json(false);
}