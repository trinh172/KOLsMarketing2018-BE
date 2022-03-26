const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const categories_db = require('../model/categories.model');
const image_db = require('../model/images.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');

exports.search_categories = async function(req, res) {
    //người dùng có thể tìm cate và địa điểm, tức là có 2 mảng list_cate và list_address truyền về cùng lúc.
    // Nếu mảng nào len = 0 thì xem như trả hết các kết quả
    //get all categroies from FE (example: list_categories: [1, 3 ,5])
    let list_cate = req.body.list_categories;
    let list_address = req.body.list_address;
    if(list_cate?.length == 0 && list_address?.length == 0){
        let result = await post_db.allActivePosts();
        return res.json(result);
    }
    if(list_cate?.length == 0 && list_address?.length > 0){
        let result = await post_db.findPostActiveInListAddress(list_address);
        return res.json(result);
    }

    if(list_cate?.length > 0){
        let postInCate = await post_db.findPostInListCategories(list_categories);
        let result = await post_db.findListActivePostByID(postInCate, list_address);
        return res.json(result);
    }
    
    return res.json(false);
}

exports.search_address = async function(req, res) {
    
    let flag = await post_db.findPostInMonth();
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}