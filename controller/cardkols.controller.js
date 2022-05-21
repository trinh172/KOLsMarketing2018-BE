const kols_db = require('../model/kols.model');
const cardkols_db = require('../model/cardkols.model')
const moment = require('moment');

exports.get_detail_card = async function(req, res) {
    //Get infor from form at FE 
    let id_kol = req.jwtDecoded.data.id;
    let flag = await cardkols_db.findCardKolsByIdKol(id_kol);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.status(404).json(null);
}

exports.update_card = async function(req, res) {
    //Get infor from form at FE 
    let id_kol = req.jwtDecoded.data.id;
    let new_card = {
        "email": req.body.email,
        "address":req.body.address,
        "phone": req.body.phone,
        "gender": req.body.gender,
        "image": req.body.image,
        "describe": req.body.describe,
    }
    let flag = await cardkols_db.updateCardKolsByIdKol(id_kol, new_card);
    if (flag){
        return res.status(200).json(new_card);
    }
    return res.status(404).json(null);
}

exports.update_state_publish = async function(req, res) {
    //Get infor from form at FE 
    let id_kol = req.jwtDecoded.data.id;
    let new_state = req.body.state;
    let flag = await cardkols_db.updateStateCard(id_kol, new_state);
    if (flag){
        return res.status(200).json(new_state);
    }
    return res.status(404).json(null);
}