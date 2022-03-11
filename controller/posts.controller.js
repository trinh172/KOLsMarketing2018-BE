const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
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