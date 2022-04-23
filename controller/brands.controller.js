const brands_db = require('../model/brands.model');
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
exports.brands_profile_detail = async function(req, res) {
    //Get infor from form at FE 
    let flag = await brands_db.getBrandsProfile(req.jwtDecoded.data.id);
    if (flag){
        return res.json(flag);
    }
    
    return res.json(false);
}
exports.get15Brands = async function(req, res) {
    let flag = await brands_db.getListBrands();
    if (flag){
        if(flag.length <= 15)
            return res.status(200).json(flag);
        let result = await shuffle(flag, 15);
        return res.status(200).json(result);
    }
    
    return res.status(400).json(null);
}

exports.get60Brands = async function(req, res) {
    let flag = await brands_db.getListBrands();
    if (flag){
        if(flag.length <= 60)
            return res.status(200).json(flag);
        let result = await shuffle(flag, 60);
        return res.status(200).json(result);
    }
    
    return res.status(400).json(null);
}