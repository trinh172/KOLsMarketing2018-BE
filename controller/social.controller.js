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
    let id_kol = req.jwtDecoded.data?.id;
    let result = await social_db.getListPageSecurityByIDKols(id_kol);
    return res.status(200).json(result);
}

exports.get_user_social_info = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    let result = await social_db.getUserSocialInfoSecurity(id_kol);
    return res.status(200).json(result);
}

exports.save_user_info = async function(req, res) {
    //const accessToken = "EAAItHe6QJV8BAFpQLVXDfmZACaSX9SbW78PGWwHNe6D1poIqtk3EL6A28AhxM9u0SZAsLVq9BVFqkFcJMcavtzEHLnGEtODZAxBokgAZARtBjmWJkakecEbDfqXWoBKbt7Yqvy6SYS82C3tvBgYP1oV2zItZBly6sHwyeOkWTya77dVnO64MyvhN5djHGnYUUt1F3ct3ciZC86k0gSaz2G";
    let accessToken = req.body.fbUser;
    let id_kol = req.jwtDecoded.data?.id;
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
    let id_kol = req.jwtDecoded.data?.id;
    let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let id_post = req.body?.id_post;
    let video_url = req.body?.video_url;
    let id_page = req.body?.id_page;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        if (image_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=true&message=${postText}&url=${image_url}`
        }
        else{
            if(video_url){
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/videos?access_token=${fbPageAccessToken}&file_url=${video_url}&description=${postText}`
            }
            else{
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=true&message=${postText}`;
            }
            
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
                "id_post_job": id_post,
                "id_post_social": response?.data?.id,
                "url_image": image_url,
                "url_video": video_url,
                "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                "state": '2',
                "content": postText,
                "type_social": '1',
                "type_schedule": '2',
                "schedule_time": moment().add(7, 'hours'),
                "create_time": moment().add(7, 'hours'),
            }
            if(image_url == null){
                if(video_url == null){
                    newPost.url_post_social = "https://facebook.com/" +  response?.data?.id;
                    const idArray = response?.data?.id.split("_");
                    response.data.id = idArray[1];
                    newPost.id_post_social = idArray[1];
                }
                else{
                    newPost.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                }
            }

            let addpost = await social_db.addNewPostSocial(newPost);
            if(addpost){
                let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                return res.status(200).json(returnpost)
            }
        }
    }
    return res.status(403).json(false);
}

exports.post_schedule = async function(req, res) {
    //Post schedule post
    let postText = req.body?.postText;
    let id_kol = req.jwtDecoded.data?.id;
    let id_page_social = req.body?.id_page_social;
    let id_post = req.body?.id_post;
    let image_url = req.body?.image_url;
    let video_url = req.body?.video_url;
    let id_page = req.body?.id_page;
    let schedule_time = req.body?.time;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
     
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        console.log("Image: ", image_url);
        if (image_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}&url=${image_url}`
        }
        else{
            if(video_url){
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/videos?access_token=${fbPageAccessToken}&file_url=${video_url}&description=${postText}&published=false&scheduled_publish_time=${schedule_time}`
            }
            else{
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}`;
            }
            
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
                "id_post_job": id_post,
                "id_post_social": response?.data?.id,
                "url_image": image_url,
                "url_video": video_url,
                "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                "state": '1',
                "content": postText,
                "type_social": '1',
                "type_schedule": '1',
                "schedule_time": new Date(schedule_time*1000).toLocaleString(),
                "create_time": moment().add(7, 'hours'),
            }
            if(image_url == null){
                if(video_url == null){
                    newPost.url_post_social = "https://facebook.com/" +  response?.data?.id;
                    const idArray = response?.data?.id.split("_");
                    response.data.id = idArray[1];
                    newPost.id_post_social = idArray[1];
                }
                else{
                    newPost.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                }
            }
            if(image_url){
                if (response?.data?.post_id == undefined){
                    newPost.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                }
            }
            let addpost = await social_db.addNewPostSocial(newPost);
            if(addpost){
                let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                return res.status(200).json(returnpost)
            }
        }
    }
    return res.status(403).json(false);
}

exports.post_video = async function(req, res) {
    //Post schedule post
    let postText = req.body.content;
    let id_kol = req.jwtDecoded.data?.id;
    let id_page_social = req.body?.id_page_social;
    let minutes = 15;
    const time = Math.round((new Date().getTime() + minutes * 60 * 1000) / 1000);
    let video_url = req.body.video_url;
    let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social);
    if(fbPageAccessToken && id_page_social){
        let req_url = "";
        if (video_url){
            req_url = `https://graph.facebook.com/v9.0/${id_page_social}/videos?access_token=${fbPageAccessToken}&file_url=${video_url}&description=${postText}&published=false&scheduled_publish_time=${time}`
            
            const response = await axios({
                url: encodeURI(req_url),
                method: "post",
            });
            if(response?.data?.id){
                console.log(" schedule post: ", response.data);
                return res.status(200).json(true);
            }
        }
        return res.status(200).json(false);
    }
    return res.status(403).json(false);
}

exports.publish_draft_immediately = async function(req, res) {
    //Post schedule post
    let image_url = req.body?.image_url;
    let video_url = req.body?.video_url;
    let postText = req.body?.postText;
    let id = req.body?.id;
    let id_page_social = req.body?.id_page_social;
    let id_page = req.body?.id_page;
    let detail_post_draft = await social_db.getDraftPostByID(id);
    console.log("Draft info: ", detail_post_draft)
    if(detail_post_draft){
        let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(detail_post_draft?.id_kol,id_page_social);
        if(fbPageAccessToken && id_page_social){
            let req_url = "";
            if (image_url){
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=true&message=${postText}&url=${image_url}`
            }
            else{
                if(video_url){
                    req_url = `https://graph.facebook.com/v9.0/${id_page_social}/videos?access_token=${fbPageAccessToken}&file_url=${video_url}&description=${postText}`
                }
                else{
                    req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=true&message=${postText}`
                }
            }
            const response = await axios({
                url: encodeURI(req_url),
                method: "post",
            });
            if(response?.data?.id){
                console.log(" immediately draft post: ", response.data);
                console.log(" immediately draft post check id: ", response.data.id);
                let update = {
                    "id_post_social": response.data.id,
                    "id_page_social": id_page_social,
                    "id_page": id_page,
                    "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                    "state": '2',
                    "type_social": '1',
                    "type_schedule": '2',
                    "url_image": image_url,
                    "url_video": video_url,
                    "content": postText,
                    "schedule_time": moment().add(7, 'hours'),
                    "create_time": moment().add(7, 'hours'),
                }
                if(image_url == null){
                    if(video_url == null){
                        update.url_post_social = "https://facebook.com/" +  response?.data?.id;
                        const idArray = response?.data?.id.split("_");
                        response.data.id = idArray[1];
                        update.id_post_social = idArray[1];
                    }
                    else{
                        update.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                    }
                }
                
                let updatepost = await social_db.updatePostByID(id, update);
                if(updatepost){
                    let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                    return res.status(200).json(returnpost)
                }
                return res.status(200).json(true);
            }
            else{
                return res.status(403).json(false);
            }
        }
    }
    return res.status(403).json(false);
}

exports.publish_draft_schedule = async function(req, res) {
    //Post schedule post
    let postText = req.body?.postText;
    let id_kol = req.jwtDecoded.data?.id;
    let image_url = req.body?.image_url;
    let video_url = req.body?.video_url;
    let id = req.body?.id;
    let id_page_social = req.body?.id_page_social;
    let id_page = req.body?.id_page;
    let detail_post_draft = await social_db.getDraftPostByID(id);
    let schedule_time = req.body?.time;
    if(detail_post_draft){
        let fbPageAccessToken = await social_db.getPageAccessByIDpageKol(id_kol, id_page_social );
        if(fbPageAccessToken && id_page_social){
            let req_url = "";
            if (detail_post_draft.url_image){
                req_url = `https://graph.facebook.com/v9.0/${id_page_social}/photos?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}&url=${image_url}`
            }
            else{
                if(detail_post_draft.url_video){
                    req_url = `https://graph.facebook.com/v9.0/${id_page_social}/videos?access_token=${fbPageAccessToken}&file_url=${video_url}&description=${postText}&published=false&scheduled_publish_time=${schedule_time}`
                }
                else{
                    req_url = `https://graph.facebook.com/v9.0/${id_page_social}/feed?access_token=${fbPageAccessToken}&published=false&scheduled_publish_time=${schedule_time}&message=${postText}`
                }
            }
            const response = await axios({
                url: encodeURI(req_url),
                method: "post",
            });
            if(response?.data?.id){
                console.log(" schedule draft post: ", response.data);
                let update = {
                    "id_post_social": response?.data?.id,
                    "id_page_social": id_page_social,
                    "id_page": id_page,
                    "id_post_social": response?.data?.id,
                    "url_post_social": "https://facebook.com/"+response?.data?.post_id,
                    "state": '1',
                    "type_social": '1',
                    "type_schedule": '1',
                    "url_image": image_url,
                    "url_video": video_url,
                    "content": postText,
                    "schedule_time": new Date(schedule_time*1000).toLocaleString(),
                    "create_time": moment().add(7, 'hours'),
                }
                if(image_url == null){
                    if(video_url== null){
                        update.url_post_social = "https://facebook.com/" +  response?.data?.id;
                        const idArray = response?.data?.id.split("_");
                        response.data.id = idArray[1];
                        update.id_post_social = idArray[1];
                    }
                    else{
                        update.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                    }
                }
                if(image_url){
                    if (response?.data?.post_id == undefined){
                        update.url_post_social = "https://facebook.com/" + id_page_social + "_" + response?.data?.id;
                    }
                }
                let updatepost = await social_db.updatePostByID(id, update);
                if(updatepost){
                    let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
                    return res.status(200).json(returnpost)
                }
                return res.status(200).json(true);
            }else{
                return res.status(403).json(false);
            }
        }
    }
    return res.status(403).json(false);
}

exports.create_draft = async function(req, res) {
    //Post fb immediately
    //let accessToken = req.body.fbUser;
    let postText = req.body?.postText;
    let id_post = req.body?.id_post;
    let id_kol = req.jwtDecoded.data?.id;
    //let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let video_url = req.body?.video_url;
    //let id_page = req.body?.id_page;
    let create_time = moment().add(7, 'hours');
    let newPost = {
        "id_kol": id_kol,
        "id_page": null,
        "id_page_social": null,
        "id_post_job": id_post,
        "id_post_social": null,
        "url_image": image_url,
        "url_video": video_url,
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

exports.update_draft = async function(req, res) {

    let postText = req.body?.postText;
    //let id_page_social = req.body?.id_page_social;
    let image_url = req.body?.image_url;
    let video_url = req.body?.video_url;
    //let id_page = req.body?.id_page;
    let id = req.body?.id;
    let create_time = moment().add(7, 'hours');

    let update = {
        "id_page": null,
        "id_page_social": null,
        "url_image": image_url,
        "url_video": video_url,
        "content": postText,
        "create_time": create_time,
    }
    let detail_post_draft = await social_db.getDraftPostByID(id);
    if (detail_post_draft){
        let updatepost = await social_db.updatePostByID(id, update);
        if(updatepost){
           // let returnpost = await social_db.getSocialByPostSocialID(response?.data?.id);
           detail_post_draft.url_image = image_url;
           detail_post_draft.url_video = video_url;
           detail_post_draft.content = postText;
           detail_post_draft.create_time = create_time;
            return res.status(200).json(detail_post_draft)
        }
        return res.status(400).json(false);
    }
    return res.status(403).json(false);
}

exports.delete_post = async function(req, res) {
    
    let id = req.body?.id;
    let delPost = await social_db.deletePostByID(id);
    if (delPost){
        return res.status(200).json(true);
    }
    return res.status(403).json(false);
}

exports.logout_fb = async function(req, res) {
    
    let id_kol = req.jwtDecoded.data?.id;
    let logout_account = await social_db.updateStateUserAccount('0', id_kol);
    if (logout_account){
        let logout_page = await social_db.updateStatePageAccount('0', id_kol);
        if(logout_page){
            return res.status(200).json(true);
        }
    }
    return res.status(403).json(false);
}

exports.get_list_draft_of_kol = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_kol = req.jwtDecoded.data?.id;
    let list_draft = await social_db.getListDraftOfKol(id_kol);
    console.log(" list draft: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json([]);
}

exports.get_list_draft_of_job = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_post = req.body?.id_post;
    let list_draft = await social_db.getListDraftOfJob(id_post);
    console.log(" list draft in job: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json([]);
}

exports.get_list_done_of_job = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_post = req.body?.id_post;
    let list_draft = await social_db.getListPostDoneOfJob(id_post);
    console.log(" list done in job: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json([]);
}

exports.get_list_schedule_of_job = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_post = req.body?.id_post;
    let list_draft = await social_db.getListPostScheduleOfJob(id_post);
    console.log(" list schedule in job: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json([]);
}

exports.accept_draft_post = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id = req.body?.id;
    let accept = await social_db.updateTypeAccept(id, '1');
    if(accept){
        return res.status(200).json(true)
    }
    return res.status(403).json(false);
}

exports.reject_draft_post = async function(req, res) {
    let id = req.body?.id;
    let reject = await social_db.updateTypeAccept(id, '2');
    if(reject){
        return res.status(200).json(true)
    }
    return res.status(403).json(false);
}

exports.get_list_schedule_of_job = async function(req, res) {
    //let id_kol = req.body?.id_kol;
    let id_post = req.body?.id_post;
    let list_draft = await social_db.getListPostScheduleOfJob(id_post);
    console.log(" list schedule in job: ", list_draft)
    if(list_draft){
        return res.status(200).json(list_draft)
    }
    return res.status(403).json([]);
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
    return res.status(403).json([]);
}

exports.get_list_publish_post_waiting = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    
    let list_wait = await social_db.getListPostScheduleWaiting(id_kol);
    console.log(" list getListPostScheduleWaiting: ", list_wait)
    if(list_wait){
        return res.status(200).json(list_wait)
    }
    return res.status(403).json([]);
}

exports.count_like_comment = async function(req, res) {
    let id_kol = req.jwtDecoded.data?.id;
    if(req.jwtDecoded.data?.role == '2'){
        id_kol = req.body?.id_kol;
    }
        
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