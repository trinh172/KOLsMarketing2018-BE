const jwtHelper = require("../utils/jwt.helper");
const kols_db = require("../model/kols.model");
const brands_db = require("../model/brands.model");
 
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
 
let isAuthor = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log(tokenFromClient);
    if (tokenFromClient && tokenFromClient!='null') {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = {};
            if(decoded.data.role == 1){
                req.jwtDecoded.data = await kols_db.findKOLsByID(decoded.data.id);
            }
            if(decoded.data.role == 2){
                req.jwtDecoded.data = await brands_db.findBrandsByID(decoded.data.id);
            }
            
            req.jwtDecoded.data.is_social_login = decoded.data.is_social_login;
            req.jwtDecoded.data.role = decoded.data.role;
            next();
        } catch (error) {
            console.log(error)
            return res.status(400).json('400');
        }
    } else {
        req.jwtDecoded = {};
        req.jwtDecoded.data = null;
        next();
        /*console.log('error 401 isAuthor')
        return res.status(401).json('401');*/
    };
}

/*
let isAuthen = async (req, res, next) => {
    let idclass;
    if(req.params.id != null){
        idclass = parseInt(req.params.id);
    }
    else{
        idclass = req.body.id_class;
    }
    console.log("check authen idclass: ", idclass);
    const isExistUserOnClass = await class_user_db.checkIsExistUserOnClass(idclass, req.jwtDecoded.data.id_uni)
    if (isExistUserOnClass==false){
        console.log('error 403 isAuthen')
        return res.status(403).json("403")
    }
    req.id_class = req.params.id;
    next();
}
*/
module.exports = {
    isAuthor: isAuthor,
};