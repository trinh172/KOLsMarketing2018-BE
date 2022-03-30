const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const image_db = require('../model/images.model');
const categories_db = require('../model/categories.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment');

exports.add_post = async function(req, res) {
    //Get infor from form at FE 
    let new_post = {
        title: req.body.title,
        gender: req.body.gender,
        id_writer: req.jwtDecoded.data.id,
        amount: req.body.amount,
        min_cast: req.body.min_cast,
        max_cast: req.body.max_cast,
        content: req.body.content,
        requirement: req.body.requirement,
        benefit: req.body.benefit,
        address: req.body.address,
        abstract: req.body.abstract,
        write_time: moment().add(7, 'hours')
    };
    let flag = await post_db.createPosts(new_post);
    console.log("Image URL: ", "/public/images/posts/" + req.file?.filename)
    let added_post = await post_db.findPostByBrandTitle(req.jwtDecoded.data.id, req.body.title);
    if (added_post){
        const new_image = {
              "id_post": added_post.id,
              "url": "/public/" + req.file?.filename,
              "type": '1',
        }
        let result_addimage = await image_db.addImagePosts(new_image);
        if (result_addimage)
            return res.status(200).json(added_post);
    }
    
    res.status(400).json(false);
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

exports.addNewImage = async function(req, res) {
    try {
        console.log("URL of new image: ", req.file?.filename)
        
    } catch (err) {
        res.status(400).json("Some thing went wrong!");
    }
}
exports.checkAvailableTittle = async function(req, res) {
    let iduser = req.jwtDecoded.data.id;
    let title = req.body.title;
    let flag = await post_db.findPostByBrandTitle(iduser, title);
    if(flag != null){
        return res.status(200).json(false);
    }
    res.status(200).json(true);
}
