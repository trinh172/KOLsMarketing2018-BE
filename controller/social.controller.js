const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const social_db = require('../model/social.model');
const image_db = require('../model/images.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');
var FB = require('fb').default;
const request = require('request-promise');
const axios = require('axios').default;

exports.get_list_page_of_kol = async function(req, res) {
    const id_kol = req.body.id_kol;
    let result = await social_db.getListPageSecurityByIDKols(id_kol);
    return res.status(200).json(result);
}

exports.get_user_social_info = async function(req, res) {
    const id_kol = req.body.id_kol;
    let result = await social_db.getUserSocialInfoSecurity(id_kol);
    return res.status(200).json(result);
}

exports.save_user_info = async function(req, res) {
    //const accessToken = "EAAItHe6QJV8BAFpQLVXDfmZACaSX9SbW78PGWwHNe6D1poIqtk3EL6A28AhxM9u0SZAsLVq9BVFqkFcJMcavtzEHLnGEtODZAxBokgAZARtBjmWJkakecEbDfqXWoBKbt7Yqvy6SYS82C3tvBgYP1oV2zItZBly6sHwyeOkWTya77dVnO64MyvhN5djHGnYUUt1F3ct3ciZC86k0gSaz2G";
    let accessToken = req.body.fbUser;
    let id_kol = req.body.id_kol;
    let expired = req.body.expired;
    const { data } = await axios({
            url:
                "https://graph.facebook.com/v9.0/me?fields=id,name&access_token=" + accessToken,
            method: "get",
    });
    console.log("User info: ", data);
    
    if(data){
        let new_user = {
            id_kol: id_kol,
            state: '1',
            id_user_social: data.id,
            account_token: accessToken,
            account_name: data.name,
            time_expired: new Date(expired*1000).toLocaleString(),
            create_time: moment().add(7, 'hours'),
        }
        let flag = await social_db.saveUserAccount(new_user);
        const list_page = await axios({
                url:
                    `https://graph.facebook.com/v9.0/${data.id}/accounts?access_token=` + accessToken,
                method: "get",
        });
        let array_page = list_page.data?.data;
        console.log("get all page: ", array_page);
        let result_page = [];
        for (i = 0; i < array_page.length; i++){
            let newPage = {
                "id_kol": id_kol,
                "id_user_account": data.id,
                "state": '1',
                "page_token": array_page[i].access_token,
                "id_page_social": array_page[i].id,
                "page_name": array_page[i].name,
                "time_expired": new Date(expired*1000).toLocaleString(),
                "create_time": moment().add(7, 'hours'),
            }
            let savePage = await social_db.savePageAccount(newPage);
            if (savePage){
                let temp = {};
                temp.id_page_social = array_page[i].id;
                temp.page_name = array_page[i].name;
                result_page.push(temp);
            }  
        }
        if(flag)
            return res.status(200).json({
                user: data,
                array_page: result_page
            });
        else return res.status(403).json(false);
    }
    return res.status(403).json(false);
}

exports.save_page_info = async function(req, res) {
    //Save page token, exprired time
    
    const accessToken = "EAAItHe6QJV8BAFpQLVXDfmZACaSX9SbW78PGWwHNe6D1poIqtk3EL6A28AhxM9u0SZAsLVq9BVFqkFcJMcavtzEHLnGEtODZAxBokgAZARtBjmWJkakecEbDfqXWoBKbt7Yqvy6SYS82C3tvBgYP1oV2zItZBly6sHwyeOkWTya77dVnO64MyvhN5djHGnYUUt1F3ct3ciZC86k0gSaz2G";
    const { data } = await axios({
            url:
                "https://graph.facebook.com/v9.0/1432909660463031/accounts?access_token=" + accessToken,
            method: "get",
    });
    console.log("page info: ", data);
    return res.json(data);
}

exports.post_status_immediately = async function(req, res) {
    //Post fb immediately
    //let accessToken = req.body.fbUser;
    let postText = req.body?.postText;
    let id_kol = req.body?.id_kol;
    let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let id_page = req.body?.id_page;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        if (image_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=true&message=${postText}&url=${image_url}`
        }
        else{
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=true&message=${postText}`
        }
        const response = await axios({
            url: encodeURI(req_url),
            method: "post",
        });
        if(response?.data?.id){
            let newPost = {
                "id_kol": id_kol,
                "id_page": id_page,
                "id_page_social": id_page_social,
                "id_job_describe": null,
                "id_post_social": response?.data?.id,
                "url_image": image_url,
                "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                "state": '2',
                "content": postText,
                "type_social": '1',
                "type_schedule": '2',
                "schedule_time": null,
                "create_time": moment().add(7, 'hours'),
            }
            let addpost = await social_db.addNewPostSocial(newPost);
            if(addpost){
                let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                return res.status(200).json(returnpost)
            }
            return res.status(200).json(true);
        }
    }
    return res.status(403).json(false);
}

exports.post_schedule = async function(req, res) {
    //Post schedule post
    let postText = req.body?.postText;
    let id_kol = req.body?.id_kol;
    let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let id_page = req.body?.id_page;
    let schedule_time = req.body?.time;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        if (image_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}&url=${image_url}`
        }
        else{
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}`
        }
        const response = await axios({
            url: encodeURI(req_url),
            method: "post",
        });
        if(response?.data?.id){
            console.log(" schedule post: ", response.data);
            let newPost = {
                "id_kol": id_kol,
                "id_page": id_page,
                "id_page_social": id_page_social,
                "id_job_describe": null,
                "id_post_social": response?.data?.id,
                "url_image": image_url,
                "url_post_social": "https://facebook.com/"+response?.data?.id,
                "state": '1',
                "content": postText,
                "type_social": '1',
                "type_schedule": '1',
                "schedule_time": new Date(schedule_time*1000).toLocaleString(),
                "create_time": moment().add(7, 'hours'),
            }
            let addpost = await social_db.addNewPostSocial(newPost);
            if(addpost){
                let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                return res.status(200).json(returnpost)
            }
            return res.status(200).json(true);
        }
    }
    return res.status(403).json(false);
}

exports.publish_draft_immediately = async function(req, res) {
    //Post schedule post
    let id = req.body?.id;
    let detail_post_draft = await social_db.getDraftPostByID(id);
    console.log("Draft info: ", detail_post_draft)
    if(detail_post_draft){
        let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(detail_post_draft?.id_kol, detail_post_draft?.id_page_social);
        if(fbPageAccessToken && detail_post_draft.id_page_social){
            let req_url = "";
            if (detail_post_draft.url_image){
                req_url = `https://graph.facebook.com/v9.0/${detail_post_draft.id_page_social}/photos?access_token=${fbPageAccessToken}&published=true&message=${detail_post_draft.content}&url=${detail_post_draft.url_image}`
            }
            else{
                req_url = `https://graph.facebook.com/v9.0/${detail_post_draft.id_page_social}/feed?access_token=${fbPageAccessToken}&published=true&message=${detail_post_draft.content}`
            }
            const response = await axios({
                url: encodeURI(req_url),
                method: "post",
            });
            if(response?.data?.id){
                console.log(" immediately draft post: ", response.data);
                let update = {
                    "id_post_social": response?.data?.id,
                    "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                    "state": '2',
                    "type_social": '1',
                    "type_schedule": '2',
                    "schedule_time": null,
                    "create_time": moment().add(7, 'hours'),
                }
                let updatepost = await social_db.updatePostByID(id, update);
                if(updatepost){
                    let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                    return res.status(200).json(returnpost)
                }
                return res.status(200).json(true);
            }
        }
    }
    return res.status(403).json(false);
}

exports.publish_draft_schedule = async function(req, res) {
    //Post schedule post
    let id = req.body?.id;
    let detail_post_draft = await social_db.getDraftPostByID(id);
    let schedule_time = req.body?.time;
    if(detail_post_draft){
        let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(detail_post_draft?.id_kol, detail_post_draft?.id_page_social );
        if(fbPageAccessToken && detail_post_draft?.id_page_social){
            let req_url = "";
            if (detail_post_draft.url_image){
                req_url = `https://graph.facebook.com/v9.0/${detail_post_draft.id_page_social}/photos?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${detail_post_draft.content}&url=${detail_post_draft.url_image}`
            }
            else{
                req_url = `https://graph.facebook.com/v9.0/${detail_post_draft.id_page_social}/feed?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${detail_post_draft.content}`
            }
            const response = await axios({
                url: encodeURI(req_url),
                method: "post",
            });
            if(response?.data?.id){
                console.log(" schedule draft post: ", response.data);
                let update = {
                    "id_post_social": response?.data?.id,
                    "url_post_social": "https://facebook.com/"+response?.data?.id,
                    "state": '1',
                    "type_social": '1',
                    "type_schedule": '1',
                    "schedule_time": new Date(schedule_time*1000).toLocaleString(),
                    "create_time": moment().add(7, 'hours'),
                }
                let updatepost = await social_db.updatePostByID(id, update);
                if(updatepost){
                    let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                    return res.status(200).json(returnpost)
                }
                return res.status(200).json(true);
            }
        }
    }
    return res.status(403).json(false);
}

exports.create_draft = async function(req, res) {
    //Post fb immediately
    //let accessToken = req.body.fbUser;
    let postText = req.body?.postText;
    let id_kol = req.body?.id_kol;
    let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let id_page = req.body?.id_page;
    let create_time = moment().add(7, 'hours');
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        if (image_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=true&message=${postText}&url=${image_url}`
        }
        else{
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=true&message=${postText}`
        }
        let newPost = {
            "id_kol": id_kol,
            "id_page": id_page,
            "id_page_social": id_page_social,
            "id_job_describe": null,
            "id_post_social": null,
            "url_image": image_url,
            "url_post_social": null,
            "state": '0',
            "content": postText,
            "type_social": '1',
            "type_schedule": '0',
            "schedule_time": null,
            "create_time": create_time,
        }
        let addpost = await social_db.addNewPostSocial(newPost);
        if(addpost){
            let returnpost = await social_db.getDraftPostByCreateTimeIdKol(create_time, id_kol);
            return res.status(200).json(returnpost)
        }
        return res.status(403).json(false);
    }
    return res.status(403).json(false);
}

exports.get_list_draft_of_kol = async function(req, res) {
    let id_kol = req.body?.id_kol;
    
    let list_draft = await social_db.getListDraftOfKol(id_kol);
    console.log(" list draft: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json(false);
}