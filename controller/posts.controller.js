const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const image_db = require('../model/images.model');
const categories_db = require('../model/categories.model');
const cate_post_db = require("../model/cate_post.model")
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

exports.add_post = async function(req, res) {
    console.log("Check many-images already upload: ", req.body.files);
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
        console.log("List cate of post: ", req.body.selectedCate)
        let cate_post = {
            "id_cate":req.body.selectedCate,
            "id_post": added_post.id
        }
        await cate_post_db.add(cate_post)
        //Xử lý post_images
        if(req.body.files.length>0){
            const new_image = {
                "id_post": added_post.id,
                "url": req.body.files[0],
                "type": '2',
            }
            let result_addimage = await image_db.addImagePosts(new_image);
            for(let i = 1; i<req.body.files.length; i++){
                let new_imagedetail = {
                    "id_post": added_post.id,
                    "url": req.body.files[i],
                    "type": '1',
                }
                await image_db.addImagePosts(new_imagedetail);
            }
            
            if (result_addimage){
                /*let detailPost = await post_db.findPostAndBrandByIDPost(added_post.id);
                if(detailPost){
                    return res.status(200).json(detailPost);
                }*/
                return res.status(200).json({id: added_post.id});
            }
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
    let idCate = req.params.id_cate;
    if(idCate){
        let flag = await post_db.findNewPostByCategory(idCate);
        if (flag){
            if(flag.length <= 12)
                return res.status(200).json(flag);
            let result = await shuffle(flag, 12);
            return res.status(200).json(result);
        }
    }
    return res.status(400).json(false);
}

exports.findNewPostByCateMore = async function(req, res) {
    let idCate = req.params.id_cate;
    if(idCate){
        let flag = await post_db.findNewPostByCategory(idCate);
        if (flag){
            if(flag.length <= 60)
                return res.status(200).json(flag);
            let result = await shuffle(flag, 60);
            return res.status(200).json(result);
        }
    }
    return res.status(400).json(false);
}

exports.find60NewestPost = async function(req, res) {
    let flag = await post_db.find60NewestPostModel();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}

exports.find120NewestPost = async function(req, res) {
    let flag = await post_db.find120NewestPostModel();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}

exports.findHighestCastPost = async function(req, res) {
    let flag = await post_db.find6HighestCastPostModel();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}

exports.findHighestCastPostMore = async function(req, res) {
    let flag = await post_db.find30HighestCastPostModel();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
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
        let flag = await post_db.findPostAndBrandByIDPost(id_post);
        if (flag){
            console.log("Check detail info of post in controller: ", flag);
            return res.json(flag);
        }
    }
    
    return res.status(400).json(false);
}

exports.kolsLikePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.kolsLikePost(req.jwtDecoded.data.id, id_post);
        if (flag){
            console.log("Check like successfully: ", flag);
            return res.json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.getAllPostKolsLikes = async function(req, res) {
    let flag = await post_db.findAllPostsKolsLike(req.jwtDecoded.data.id);
    if (flag){
        console.log("getAllPostKolsLikes: ", flag);
        return res.json(flag);
    }
    return res.status(400).json(false);
}

exports.getAllPostKolsRecruitment = async function(req, res) {
    let flag = await post_db.findAllPostsKolsRecruitment(req.jwtDecoded.data.id);
    if (flag){
        console.log("getAllPostKols Recruitment: ", flag);
        return res.json(flag);
    }
    return res.status(400).json(false);
}

exports.kolsUnlikePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.kolsUnlikePost(req.jwtDecoded.data.id, id_post);
        if (flag){
            console.log("Check unlike successfully: ", flag);
            return res.json(flag);
        }
    }
    return res.status(400).json(false);
}