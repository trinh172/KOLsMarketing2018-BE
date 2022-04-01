const cate_db = require('../model/categories.model')
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


exports.getListCategories = async function(req, res) {
    //Get infor from form at FE 
    let flag = await cate_db.allCategories();
    if (flag){
        return res.status(200).json(flag);
    }
    
    return res.status(400).json(false);
}