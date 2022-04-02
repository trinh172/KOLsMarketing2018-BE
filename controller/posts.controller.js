const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const image_db = require('../model/images.model');
const categories_db = require('../model/categories.model');
const cate_post_db = require("../model/cate_post.model")
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment');

exports.add_post = async function(req, res) {
    console.log("Check many-images already upload: ", req.files);
    console.log("Check title already upload: ", req.body.title);
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
        address: req.body.selectedAddress,
        write_time: moment().add(7, 'hours')
    };
    let flag = await post_db.createPosts(new_post);
    
    let added_post = await post_db.findPostByBrandTitle(req.jwtDecoded.data.id, req.body.title);
    if (added_post){
        //Xử lý post_categories
        console.log("List cate of post: ", req.body.categories)
        let cate_post = {
            "id_cate":req.body.categories,
            "id_post": added_post.id
        }
        await cate_post_db.add(cate_post)
        //Xử lý post_images
        if(req.files?.length>0){
            const new_image = {
                "id_post": added_post.id,
                "url": "/public/images/posts/" + req.files[0].filename,
                "type": '2',
            }
            let result_addimage = await image_db.addImagePosts(new_image);
            for(let i = 1; i<req.files.length; i++){
                let new_imagedetail = {
                    "id_post": added_post.id,
                    "url": "/public/images/posts/" + req.files[i].filename,
                    "type": '1',
                }
                await image_db.addImagePosts(new_imagedetail);
            }
            
            if (result_addimage)
                return res.status(200).json(added_post);
        }
    }
    
    res.status(400).json(false);
}
exports.delete_post = async function(req, res) {
    let post_id = req.body.id_post;
    let flag = await post_db.delete_post(post_id);
    if (flag){
        return res.status(200).json(true);
    }
    
    return res.status(400).json(false);
}

exports.findTop9PostHomepage = async function(req, res) {
    
    let flag = await post_db.findTop9MostRead();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}

exports.findPostInMonthHomepage = async function(req, res) {
    
    let flag = await post_db.findPostInMonth();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}
exports.findNewPostByCateHomepage = async function(req, res) {
    let idCate = req.body.id_cate;
    if(idCate){
        let flag = await post_db.findNewPostByCategory(idCate);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    
    return res.status(400).json(false);
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
exports.getDetailPost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.findPostsByID(id_post);
        if (flag){
            console.log("Check detail info of post in controller: ", flag);
            return res.json(flag);
        }
    }
    
    return res.status(400).json(false);
}
