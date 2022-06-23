const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const statistic_db = require('../model/statistic.model');
const social_db = require('../model/social.model');
const kols_db = require('../model/kols.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');
const request = require('request-promise');
const axios = require('axios').default;

//post job

exports.count_job_of_kol = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await statistic_db.countJobOf1User(id_kol, '1');
    return res.status(200).json(result);
}

exports.count_all_post_of_brand_per_month = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    let result = await statistic_db.countPostOfBrandPerMonth(id_brand);
    if(result.length > 0){
        let temp = 0;
        let new_array = [];
        while (temp < result.length){
            let new_obj = {
                'time': result[temp].mon + ' - ' + result[temp].yyyy,
                'total': result[temp].total
            }
            new_array.push(new_obj);
            temp = temp + 1;
        }
        return res.status(200).json(new_array)
    }
    return res.status(400).json([]);

}
exports.count_like_share_cmt_per_post = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    //lấy ra các post của brand
    //với mỗi post tìm ra các bài đăng và thực hiện cộng like, share, cmt của bài đăng đó
    let array_post = await post_db.findAllPostOfBrands(id_brand);
    let result = [];
    if(array_post.length > 0){
        let temp_c = 0;
        while (temp_c < array_post.length){
            let list_social_post_done = await social_db.getListPublishPostDoneInPostOfBrand( array_post[temp_c].id);
            if(list_social_post_done.length > 0){
                const len_arr = list_social_post_done.length;
                let count_like = 0;
                let count_comment = 0;
                let count_share = 0;
                let temp_count = 0;
                while (temp_count < len_arr){
                    count_like = count_like + list_social_post_done[temp_count].count_like;
                    count_comment = count_comment + list_social_post_done[temp_count].count_comment;
                    count_share = count_share + list_social_post_done[temp_count].count_share;
                    
                    temp_count = temp_count + 1;
                }
                result.push({
                    post_title: array_post[temp_c].title,
                    count_comment: count_comment,
                    count_like: count_like,
                    count_share: count_share
                });
                
            }
            temp_c = temp_c + 1;
        }
        return res.status(200).json(result);
    }
    return res.status(400).json([]);
}
exports.count_kol_work_with_brand = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    let result = await statistic_db.countKOLWorkWithBrand(id_brand);
    console.log("count kol: ", result)
    if(result.length == 0)
        return res.status(200).json(0)
    else{
        let des_array = Array.from(new Set(result));
        return res.status(200).json(des_array.length);
    }
}
//social post
exports.count_social_draft_post_of_1_kol = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await statistic_db.countPostSocialAndDraftOf1Kol(id_kol);
    return res.status(200).json(result);
}
exports.count_recruit_of_brand = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    let result = await statistic_db.countRecruitmentOfBrand(id_brand);
    return res.status(200).json(result);
}

//kol-brand like
//đếm số lượng brand đã like mình (kols)
exports.number_brand_like_kol = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await statistic_db.countNumberOfBrandLikeKol(id_kol);
    return res.status(200).json(result);
}
//đếm số lượng brand mà mình (kol) đã like
exports.number_brand_kol_like = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await statistic_db.countNumberOfBrandKolLike(id_kol);
    return res.status(200).json(result);
}

//đếm số lượng kol đã like mình (brand)
exports.number_kol_like_brand = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    let result = await statistic_db.countNumberOfKolLikeBrand(id_brand);
    return res.status(200).json(result);
}
//đếm số lượng kol mà mình (brand) đã like
exports.number_kol_brand_like = async function(req, res) {
    let id_brand = req.jwtDecoded.data?.id;
    let result = await statistic_db.countNumberOfKolBrandLike(id_brand);
    return res.status(200).json(result);
}

exports.get_list_page_of_kol = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await social_db.getListPageSecurityByIDKols(id_kol);
    return res.status(200).json(result);
}

exports.get_user_social_info = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await social_db.getUserSocialInfoSecurity(id_kol);
    return res.status(200).json(result);
}

exports.get_list_draft_of_kol = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_kol = req.jwtDecoded.data?.id;
    let list_draft = await social_db.getListDraftOfKol(id_kol);
    console.log(" list draft: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json(false);
}

exports.get_list_publish_post_done = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    
    let list_done = await social_db.getListPublishPostDone(id_kol);
    //console.log(" list getListPublishPostDone: ", list_done)
    /*
    if(list_done.length > 0){
        let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, list_done[0].id_page_social );
        for(i = 0; i < list_done.length; i++){
            let req_url = `https://graph.facebook.com/v9.0/${list_done[i].id_page_social}_${list_done[i].id_post_social}?access_token=${fbPageAccessToken}&fields=comments.limit(0).summary(true),likes.limit(0).summary(true)`;
            let response = await axios({
                url: encodeURI(req_url),
                method: "get",
            });

            if(response?.data){
                list_done[i].count_like = response.data.likes.summary.total_count;
                list_done[i].count_comment = response.data.comments.summary.total_count;
            }
        }
    }*/
    if(list_done){
        return res.status(200).json(list_done)
    }
    return res.status(403).json(false);
}

exports.get_list_publish_post_waiting = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    
    let list_wait = await social_db.getListPostScheduleWaiting(id_kol);
    console.log(" list getListPostScheduleWaiting: ", list_wait)
    if(list_wait){
        return res.status(200).json(list_wait)
    }
    return res.status(403).json(false);
}

exports.count_like_comment = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let id_page_social = req.body.id_page_social;
    let id_post_social = req.body.id_post_social;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social );
    if(fbPageAccessToken){
        let req_url = `https://graph.facebook.com/v9.0/${id_page_social}_${id_post_social}?access_token=${fbPageAccessToken}&fields=comments.limit(0).summary(true),likes.limit(0).summary(true),shares`;
        let response = await axios({
            url: encodeURI(req_url),
            method: "get",
        });
    
        if(response?.data){
            console.log("Count like, share, comment: ", response.data);
            let result = {};
            result.count_like = response.data.likes.summary.total_count;
            result.count_comment = response.data.comments.summary.total_count;
            result.count_share = 0;
            if(response.data?.shares){
                result.count_share = response.data?.shares.count;
            }
            return res.status(200).json(result)
        }
    }
    
    return res.status(403).json(false);
}

exports.count_like_comment_in_job = async function(req, res) {
    let id_kol = req.body?.id_kol;
    let id_post = req.body.id_post;
    let list_post_done = await social_db.getListPublishPostDoneInJob(id_kol, id_post);
    if(list_post_done.length > 0){
        const len_arr = list_post_done.length;
        let count_like = 0;
        let count_comment = 0;
        let count_share = 0;
        let temp_count = 0;
        let fbPageAccessToken = "";
        while (temp_count < len_arr){
            fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, list_post_done[temp_count].id_page_social);
            if(fbPageAccessToken){
                let req_url = `https://graph.facebook.com/v9.0/${list_post_done[temp_count].id_page_social}_${list_post_done[temp_count].id_post_social}?access_token=${fbPageAccessToken}&fields=comments.limit(0).summary(true),likes.limit(0).summary(true),shares`;
                let response = await axios({
                    url: encodeURI(req_url),        
                });
            
                if(response?.data){
                    console.log("Count like, share, comment: ", response.data);
                    count_like = count_like + response.data.likes.summary.total_count;
                    count_comment = count_comment + response.data.comments.summary.total_count;
                    if(response.data?.shares){
                        count_share = count_share + response.data?.shares.count;
                    }
                }
            }
            temp_count = temp_count + 1;
        }
        return res.status(200).json({
            count_comment: count_comment,
            count_like: count_like,
            count_share: count_share
        })
    }
    
    return res.status(403).json(null);
}