const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const post_unlogin_db = require('../model/post_notlogin.model');
const recruit_db = require('../model/recruitments.model');
const image_db = require('../model/images.model');
const job_db = require('../model/job.model');
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
        let removed = array.splice(Math.floor(Math.random()*array.length),1);
        temp.push(removed[0]);
    }
    return temp;
 };

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
        address: req.body.selectedAddress,
        write_time: moment().add(7, 'hours')
    };
    let flag = await post_db.createPosts(new_post);
    
    let added_post = await post_db.findPostByBrandTitle(req.jwtDecoded.data.id, req.body.title);
    if (added_post){
        //Xử lý post_categories
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
        }
        //Xử lý job (member)
        let new_mem = {
            'id_post':added_post.id,
            'id_user': req.jwtDecoded.data.id,
            'role': 2,
            'state': 3,
            'create_time':  moment().add(7, 'hours')
        }
        await job_db.create_job_member(new_mem);
        if (new_mem){
            return res.status(200).json({id: added_post.id});
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
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findTop9MostRead(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.findTop9MostRead();
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.findPostInMonthHomepage = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findPostInMonth(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.findPostInMonth();
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}
exports.findNewPostByCateHomepage = async function(req, res) {
    let idCate = req.params.id_cate;
    if(idCate){
        if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
            let flag = await post_db.findNewPostByCategory(idCate, req.jwtDecoded.data?.id);
            if (flag){
                if(flag.length <= 12)
                    return res.status(200).json(flag);
                let result = await shuffle(flag, 12);
                return res.status(200).json(result);
            }
        }
        else{
            let flag = await post_unlogin_db.findNewPostByCategory(idCate);
            if (flag){
                if(flag.length <= 12)
                    return res.status(200).json(flag);
                let result = await shuffle(flag, 12);
                return res.status(200).json(result);
            }
        }
    }
    return res.status(400).json(false);
}

exports.findNewPostByCateMore = async function(req, res) {
    let idCate = req.params.id_cate;
    if(idCate){
        if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
            let flag = await post_db.findNewPostByCategory(idCate, req.jwtDecoded.data?.id);
            if (flag){
                if(flag.length <= 60)
                    return res.status(200).json(flag);
                let result = await shuffle(flag, 60);
                return res.status(200).json(result);
            }
        }
        else{
            let flag = await post_unlogin_db.findNewPostByCategory(idCate);
            if (flag){
                if(flag.length <= 60)
                    return res.status(200).json(flag);
                let result = await shuffle(flag, 60);
                return res.status(200).json(result);
            }
        }
    }
    return res.status(400).json(false);
}

exports.find60NewestPost = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.find60NewestPostModel(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.find60NewestPostModel();
        if (flag){
            return res.status(200).json(flag);
        }
    }
    
    return res.status(400).json(false);
}

exports.find120NewestPost = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.find120NewestPostModel(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.find120NewestPostModel();
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.findHighestCastPost = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.find6HighestCastPostModel(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.find6HighestCastPostModel();
        if (flag){
            return res.status(200).json(flag);
        }
    }
    
    return res.status(400).json(false);
}

exports.findHighestCastPostMore = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.find30HighestCastPostModel(req.jwtDecoded.data?.id);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    else{
        let flag = await post_unlogin_db.find30HighestCastPostModel();
        if (flag){
            return res.status(200).json(flag);
        }
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
        if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
            let flag = await post_db.findPostAndBrandByIDPost(id_post, req.jwtDecoded.data?.id);
            if (flag){
                flag.views = flag.views + 1;
                await post_db.updateView(flag.views, id_post);
                flag.recruitment = await recruit_db.findRecruitmentByKolsPost(req.jwtDecoded.data?.id, id_post);
                return res.status(200).json(flag);
            }
        }
        else{
            let flag = await post_unlogin_db.findPostAndBrandByIDPost(id_post);
            if (flag){
                flag.views = flag.views + 1;
                await post_db.updateView(flag.views, id_post);
                return res.status(200).json(flag);
            }
        }
    }
    
    return res.status(400).json(false);
}

exports.kolsLikePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.kolsLikePost(req.jwtDecoded.data.id, id_post);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.getAllPostKolsLikes = async function(req, res) {
    let flag = await post_db.findAllPostsKolsLike(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}

exports.getAllPostKolsRecruitment = async function(req, res) {
    let flag = await post_db.findAllPostsKolsRecruitment(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}

exports.kolGetAllActivePostOfBrand = async function(req, res) {
    let id_brand = req.body.id_brand;
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findActivePostOfBrandsLikeInfor(id_brand, req.jwtDecoded.data?.id, false);
        if (flag){
            return res.status(200).json(flag);
        }
        return res.status(400).json([]);
    }
    else{
        let flag = await post_unlogin_db.findActivePostOfBrands(id_brand, false);
        if (flag){
            return res.status(200).json(flag);
        }
        return res.status(400).json([]);
    }
}

exports.kolGet2ActivePostOfBrand = async function(req, res) {
    let id_brand = req.body.id_brand;
    let id_current = req.body.id_post;
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findActivePostOfBrandsLikeInfor(id_brand, req.jwtDecoded.data?.id, id_current);
        if (flag){
            if(flag.length <= 2)
                return res.status(200).json(flag);
            let result = await shuffle(flag, 2);
            return res.status(200).json(result);
        }
        return res.status(400).json([]);
    }
    else{
        let flag = await post_unlogin_db.findActivePostOfBrands(id_brand, id_current);
        if (flag){
            if(flag.length <= 2)
                return res.status(200).json(flag);
            let result = await shuffle(flag, 2);
            return res.status(200).json(result);
        }
        return res.status(400).json([]);
    }
    
}

exports.getAllActivePostOfBrand = async function(req, res) {
    let flag = await post_db.findAllActivePostsRecruitmentBrand(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}
exports.getAllUnactivePostOfBrand = async function(req, res) {
    let flag = await post_db.findUnactivePostOfBrands(req.jwtDecoded.data.id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(400).json([]);
}

exports.kolsUnlikePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.kolsUnlikePost(req.jwtDecoded.data.id, id_post);
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.getAllSuggestPost = async function(req, res) {
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findSuggestPost( req.jwtDecoded.data?.id, false);
        if (flag){
            return res.status(200).json(flag);
        }
        return res.status(400).json(false);
    }
    else{
        let flag = await post_unlogin_db.findSuggestPost( false);
        if (flag){
            return res.status(200).json(flag);
        }
        return res.status(400).json([]);
    }
}

exports.get12SuggestPost = async function(req, res) {
    let id_current = req.body?.id_post;
    if(req.jwtDecoded.data?.id && req.jwtDecoded.data?.role == 1){
        let flag = await post_db.findSuggestPost( req.jwtDecoded.data?.id, id_current);
        if (flag){
            if(flag.length <= 12)
                return res.status(200).json(flag);
            let result = await shuffle(flag.slice(0,12), 12);
            return res.status(200).json(result);
        }
        return res.status(400).json([]);
    }
    else{
        let flag = await post_unlogin_db.findSuggestPost( id_current);
        if (flag){
            if(flag.length <= 12)
                return res.status(200).json(flag);
            let result = await shuffle(flag.slice(0,12), 12);
            return res.status(200).json(result);
        }
        return res.status(400).json([]);
    }
    
}

exports.getSuggestNotDupSaveRecruitPost = async function(req, res) {
    let list_save_recruit = await post_db.findListIDPostKolSaveRecruit(req.jwtDecoded.data?.id);
    let values = [];
    if (list_save_recruit.length > 0){
        values = list_save_recruit.map(({ id_post }) => id_post);
    }
    let flag = await post_db.findSuggestPostNotDupSaveRecruit( req.jwtDecoded.data?.id, values);
    if (flag){
        if(flag.length <= 12)
            return res.status(200).json(flag);
        let result = await shuffle(flag.slice(0,12), 12);
        return res.status(200).json(result);
    }
    return res.status(400).json([]);
    
}

exports.activePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.updateStateOfPost( id_post, '1');
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}

exports.unactivePost = async function(req, res) {
    let id_post = req.body.id_post;
    if(id_post){
        let flag = await post_db.updateStateOfPost( id_post, '0');
        if (flag){
            return res.status(200).json(flag);
        }
    }
    return res.status(400).json(false);
}