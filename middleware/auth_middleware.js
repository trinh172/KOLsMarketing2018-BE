const jwtHelper = require("../utils/jwt.helper");
const kols_db = require("../model/kols.model");
const brands_db = require("../model/brands.model");
 
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
 
let isAuthor = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log("Token from client isAuthor: ", tokenFromClient);
    if (tokenFromClient && tokenFromClient!='null') {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            if(decoded === "expired"){
                console.log(decoded)
                return res.status(403).json('403');
            }
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
let isLogin = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log("Token from client isAuthor: ", tokenFromClient);
    if (tokenFromClient && tokenFromClient!='null') {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            if(decoded === "expired"){
                console.log(decoded)
                return res.status(403).json('403');
            }
            else{
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
            }
            
        } catch (error) {
            console.log(error)
            return res.status(400).json('400');
        }
    } else {
        console.log('error 401 iddLogin')
        return res.status(401).json('401');
    };
}
let isBrand = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log("Token from client isBrand, ", tokenFromClient);
    if (tokenFromClient && tokenFromClient!='null') {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = {};
            if(decoded === "expired"){
                console.log(decoded)
                return res.status(403).json('403');
            }
            if(decoded.data.role == 2){
                req.jwtDecoded.data = await brands_db.findBrandsByID(decoded.data.id);
                req.jwtDecoded.data.is_social_login = decoded.data.is_social_login;
                req.jwtDecoded.data.role = decoded.data.role;
                next();
            }
            else{
                console.log('error 401 isBrand')
                return res.status(401).json('401');
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json('400');
        }
    } else {
        console.log('error 401 isBrand')
        return res.status(401).json('401');
    };
}
let isKOLs = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log("Token from client isKOLs, ", tokenFromClient);
    if (tokenFromClient && tokenFromClient!='null') {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            if(decoded === "expired"){
                console.log(decoded)
                return res.status(403).json('403');
            }
            req.jwtDecoded = {};
            if(decoded.data.role == 1){
                req.jwtDecoded.data = await kols_db.findKOLsByID(decoded.data.id);
                req.jwtDecoded.data.is_social_login = decoded.data.is_social_login;
                req.jwtDecoded.data.role = decoded.data.role;
                next();
            }
            else{
                console.log('error 401 isKOLs')
                return res.status(401).json('401');
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json('400');
        }
    } else {
        console.log('error 401 isKOLs')
        return res.status(401).json('401');
    };
}
module.exports = {
    isAuthor: isAuthor,
    isBrand: isBrand,
    isKOLs: isKOLs,
    isLogin: isLogin
};