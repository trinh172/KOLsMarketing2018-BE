const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const post_unlogin_db = require('../model/post_notlogin.model');
const image_db = require('../model/images.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');

exports.search_categories_address = async function(req, res) {
    //người dùng có thể tìm cate và địa điểm, tức là có 2 mảng list_cate và list_address truyền về cùng lúc.
    // Nếu mảng nào len = 0 thì xem như ko quan tâm mảng đó
    // Có 3 trường hợp: 
    // Với cate = [], address = [] --> trả về 60 bài mới nhất
    // Với cate = [], address = có --> query theo address, ignore cate --> hàm searchByAddress
    // Với cate = có, address = []/có --> query theo cate trước rồi xét address--> hàm searchByCateAddress
    
    let list_cate = req.body.list_categories;
    let list_address = req.body.list_address;
    if(list_cate?.length == 0 && list_address?.length == 0){
        if(req.jwtDecoded?.data?.id && req.jwtDecoded?.data?.role == 1){
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
    }
    if(list_cate?.length == 0 && list_address?.length > 0){
        if(req.jwtDecoded?.data?.id && req.jwtDecoded?.data?.role == 1){
            let flag = await post_db.findPostActiveInListAddress(list_address, req.jwtDecoded.data?.id);
            if (flag){
                return res.status(200).json(flag);
            }
        }
        else{
            let flag = await post_unlogin_db.findPostActiveInListAddress(list_address);
            if (flag){
                return res.status(200).json(flag);
            }
        }
    }

    if(list_cate?.length > 0){
        if(req.jwtDecoded?.data?.id && req.jwtDecoded?.data?.role == 1){
            //trả về danh sách các idpost thuộc list_cate
            let postInCate = await post_db.findPostInListCategories(list_cate);
            let values = [];
            if (postInCate.length > 0){
                values = postInCate.map(({ id_post }) => id_post);
            }
            //trả về kết quả các post dựa vào mảng id_post trên có address thỏa
            let result = await post_db.findListActivePostByListIDAndAddress(values, list_address, req.jwtDecoded.data?.id);
            if (result)
                return res.status(200).json(result);
        }
        else{
            //trả về danh sách các idpost thuộc list_cate
            let postInCate = await post_unlogin_db.findPostInListCategories(list_cate);
            let values = [];
            if (postInCate.length > 0){
                values = postInCate.map(({ id_post }) => id_post);
            }

            //trả về kết quả các post dựa vào mảng id_post trên có address thỏa
            let result = await post_unlogin_db.findListActivePostByListIDAndAddress(values, list_address);
            if (result){
                return res.status(200).json(result);
            }
        }
        
    }
    return res.json([]);
}