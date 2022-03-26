const brands_db = require('../model/brands.model');
const post_db = require('../model/posts.model');
const categories_db = require('../model/categories.model');
const image_db = require('../model/images.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const moment = require('moment');

exports.search_categories = async function(req, res) {
    //get all categroies from FE (example: list_categories: [1, 3 ,5])
    let list_cate = req.body.list_categories;
    let id_post = [];
    //for each category --> get list id_post
    return res.json(false);
}

exports.search_address = async function(req, res) {
    
    let flag = await post_db.findPostInMonth();
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}