const brands_db = require('../model/brands.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


exports.brands_profile_detail = async function(req, res) {
    //Get infor from form at FE 
    let flag = await brands_db.findBrandsByID(req.jwtDecoded.data.id);
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}