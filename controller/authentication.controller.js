const kols_db = require('../model/kols.model');
const cardkols_db = require('../model/cardkols.model')
const brands_db = require('../model/brands.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const mailContent = require('../controller/mailContent.controller')


exports.kols_register = async function(req, res) {
    //Get infor from form at FE 
    const hash = bcrypt.hashSync(req.body.password, 10);
    const user = {
        password: hash,
        full_name: req.body.fullname,
        email: req.body.email,
        create_time: moment().add(7, 'hours'),
        otp: -1
    }
    let flag = await kols_db.createKOLs(user);
    if (flag){
        let createdkol = await kols_db.findKOLsByEmail(req.body.email);
        if(createdkol){
            let createCard = await cardkols_db.createCardKols(createdkol.id);
            if (createCard)
                return res.json(true);
        }
    }
    
    return res.json(false);
}

exports.brands_register = async function(req, res) {
    //Get infor from form at FE 
    //Gender 1: Nam, 2: Nữ, 3: Khác
    const hash = bcrypt.hashSync(req.body.password, 10);
    const user = {
        password: hash,
        full_name: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        address: req.body.address,
        brand_name: req.body.brandname,
        create_time: moment().add(7, 'hours'),
        otp: -1
    }
    
    let flag = await brands_db.createBrands(user);
    if (flag){
        return res.json(true);
    }
    return res.json(false);
}

exports.is_available = async (req, res)=>{
    const email = req.body.email;

    if(email == '')
        return res.json ({message: 'Email không hợp lệ!'});
    if(req.body.password == '')
        return res.json ({message: 'Bạn chưa nhập password'});
    if(req.body.fullname == '')
        return res.json ({message: 'Bạn chưa nhập họ tên'});
    const rowsEmailKOLs = await kols_db.findKOLsByEmail(email);
    const rowsEmailBrands = await brands_db.findBrandsByEmail(email);

    if (rowsEmailKOLs !== null)  
        return res.json({message: 'Email không hợp lệ!'});
    if (rowsEmailBrands !== null)  
        return res.json({message: 'Email không hợp lệ!'});

    return res.json(true);
}

exports.is_available_email = async (req, res)=>{
    const email = req.body.email;
    const rowsEmailKOLs = await kols_db.findKOLsByEmail(email);
    const rowsEmailBrands = await brands_db.findBrandsByEmail(email);
    if (rowsEmailKOLs !== null)  
        return res.json(false);
    if (rowsEmailBrands !== null)  
        return res.json(false);

    return res.json(true);
}


exports.get_otp = async (req, res) => {
    const email = req.body.email;
    const kol_user = await kols_db.findKOLsByEmail(req.body.email);
    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    if (kol_user === null){
        let brand_user = await brands_db.findBrandsByEmail(req.body.email);
        if (brand_user === null)  
            return res.status(404).json(false);
        else{
            await brands_db.updateOTPByEmailBrands(email, otp)
        }
    }
    else{
        await kols_db.updateOTPByEmailKOLs(email, otp);
    }
    // send otp to email
    console.log("email, otp to sendOTP:", email, otp);
    let content = await mailContent.getOTPmail( email, otp);
    let transporter = nodemailer.createTransport(
        {
            service: "hotmail",
            auth: {
              user: 'kolsmarketing@hotmail.com',
              pass: 'Thangtrinh@kols18'
            },
    });
    
    var mailOptions={
        from: "kolsmarketing@hotmail.com",
        to: email,
        subject: "Quên mật khẩu",
        html: content,
    };
     
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Sent email error: ", error);
            return res.status(404).json(false);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return res.status(200).json(true)
    });

}

exports.check_otp_brand = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log("check otp:", req.body);
    const row_user = await brands_db.findBrandsByEmail(email);
    if (row_user === null || row_user.otp != otp)
        return res.status(404).json(false);
    await brands_db.updateOTPByEmailBrands(email, -1);
    return res.status(200).json(true);
}

exports.check_otp_kol = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log("check otp:", req.body);
    const row_user = await kols_db.findKOLsByEmail(email);
    if (row_user === null || row_user.otp != otp)
        return res.status(404).json(false);
    await kols_db.updateOTPByEmailKOLs(email, -1);
    return res.status(200).json(true);
}

exports.change_password_kols = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email;
    await kols_db.updatePasswordByEmail(email, hash);
    return res.status(200).json(true);
}

exports.change_password_brands = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email;
    await brands_db.updatePasswordByEmail(email, hash);
    return res.status(200).json(true);
}

exports.kols_signin = async (req, res) => {
    const row_user = await kols_db.findKOLsByEmail(req.body.email);
    
    if (row_user != null) {
        return checkPassword(row_user, req, res, 1);
    }
    console.log("Email/Password không đúng")
    return res.json({'access_token':'error_email'});
}
exports.brands_signin = async (req, res) => {
    const row_user = await brands_db.findBrandsByEmail(req.body.email);
    if (row_user != null) {
        return checkPassword(row_user, req, res, 2);
    }
    console.log("Email/Password không đúng")
    return res.json({'access_token':'error_email'});
}

//TODO: Update login google later

exports.google_signin = async (req, res) => {
    
    console.log("signin:", req.body);
    let row_user = await kols_db.findKOLsByEmail(req.body.email);
    console.log("row_user:",row_user);
    if (row_user == null) {
        let hash = bcrypt.hashSync(req.body.password, 10);
        const new_user ={
            password: hash,
            full_name: req.body.fullname,
            email: req.body.email,
            create_time: moment().add(7, 'hours'),
            otp: -1
        };
        await kols_db.createKOLs(new_user);
    }
    row_user = await kols_db.findKOLsByEmail(req.body.email);
    return handle_login_successfully(row_user, req, res, true, false, 1);
}
/*
exports.brand_google_signin = async (req, res) => {
    console.log("signin:", req.body);
    let row_user = await user_db.findUserByUsername(req.body.username);
    console.log("row_user:",row_user);
    if (row_user == null) {
        const new_user = req.body;
        new_user.password = bcrypt.hashSync(req.body.password, 10);
        await user_db.addNewUser(new_user);
    }
    row_user = await user_db.findUserByUsername(req.body.username);
    return handle_login_successfully(row_user, req, res, true, false);
}*/

async function checkPassword(rows, req, res, role) {
  const ret = bcrypt.compareSync(req.body.password, rows.password);
  if(rows.otp == -2){
    console.log("Tài khoản đã bị khóa")
    return res.json({'access_token':'error_password'});
  }
  if (ret===false){
    console.log("Password không đúng")
    return res.json({'access_token':'error_password'});
  }
  else{
    console.log("login thanh cong")
    return handle_login_successfully(rows, req, res, false, false, role);
  }
}
async function checkPasswordAdmin(rows, req, res) {
    const ret = bcrypt.compareSync(req.body.password, rows.password);
    if (ret===false){
      console.log("Password không đúng")
      return res.json({'access_token':'error_password'});
    }
    else{
      console.log("login admin thanh cong");
      return handle_login_successfully(rows, req, res, false, true);
    }
  }
exports.login_successfully = handle_login_successfully;

async function handle_login_successfully(rows, req, res, loggedBySocial, isadmin, role) {
    // dang nhap thanh cong thi luu thong tin bang JWT
    try{
        //This is JWT
        
        const accessToken = await jwtHelper.generateToken(rows, accessTokenSecret, accessTokenLife, loggedBySocial, isadmin, role);
        let data = {};
        data.isAdmin = isadmin;
        data.role = role;
        data.access_token = accessToken;
        return res.json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}
