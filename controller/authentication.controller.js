const kols_db = require('../model/kols.model')
const brands_db = require('../model/brands.model');
const bcrypt = require('bcryptjs');
const jwtHelper = require("../utils/jwt.helper");
const nodemailer = require('nodemailer');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


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
        return res.json(true);
    }
    
    return res.json(false);
}

exports.brands_register = async function(req, res) {
    //Get infor from form at FE 
    const hash = bcrypt.hashSync(req.body.password, 10);
    const user = {
        password: hash,
        full_name: req.body.fullname,
        email: req.body.email,
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

//TODO: Define later
/*
exports.get_otp = async (req, res) => {
    const email = req.body.email;
    const rowsUser = await user_db.findUserByEmail(email);
    if (rowsUser === null)  
        return res.json(false);
    // send otp to email
    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log("email, otp to sendOTP:", email, otp);
    await user_db.updateOTP(email, otp);
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'newspaper.vuonghieutrinh@gmail.com',
                pass: 'vuongthangtrinh'
            },
    });
    
    var mailOptions={
        from: "newspaper.vuonghieutrinh@gmail.com",
        to: email,
        subject: "Classroom Clone: Mã OTP cho việc đặt lại mật khẩu",
        html: `<p>Chào bạn,${email}</p>`+
        "<h3>Hãy nhập OTP bên dưới để thiết lập lại mật khẩu </h3>"  + 
        "<h1 style='font-weight:bold;'>" + otp +"</h1>" +
        "<p>Cảm ơn</p>",
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        else{
            console.log('mail sent');
         } 
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    return res.json(true);
}

exports.check_otp = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log("check otp:", req.body);
    const row_user = await user_db.findUserByEmail(email);
    if (row_user === null || row_user.otp != otp)
        return res.json(false);
    await user_db.updateOTP(email, -1);
    return res.json(true);
}

exports.change_password = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email;
    await user_db.updatePassword(email, hash);
    return res.json(true);
}
*/
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
