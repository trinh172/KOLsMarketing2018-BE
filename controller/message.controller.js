const mess_db = require('../model/message.model');
const moment = require('moment')
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.openRoom = async function(req, res) {
    //Get infor from form at FE 
    let flag = await mess_db.findRoomBy2User(req.jwtDecoded.data?.id, req.jwtDecoded.data?.role, req.body?.iduser, req.body?.role);
    if (flag!= null){
        return res.status(200).json(flag);
    }
    else {
        let addsuccess = await mess_db.addRoom2User(req.jwtDecoded.data.id, req.jwtDecoded.data.role, req.body.iduser, req.body.role);
        if (addsuccess == true){
            let newRoom = await mess_db.findRoomBy2User(req.jwtDecoded.data?.id, req.jwtDecoded.data?.role, req.body?.iduser, req.body?.role);
            await mess_db.add_check_read_room(newRoom.id, req.jwtDecoded.data?.id, req.jwtDecoded.data?.role);
            await mess_db.add_check_read_room(newRoom.id, req.body?.iduser, req.body?.role);
            newRoom.state = 1;
            return res.status(200).json(newRoom); 
        } 
    }
    return res.status(400).json(null);
}
exports.getRoomMessage = async function(req, res) {
    //Get infor from form at FE 
    let flag = await mess_db.messageByIDRoom(req.body.room_id);
    if (flag){
        return res.status(200).json(flag);
    }
    return res.json(null);
}
exports.getAllRoom = async function(req, res) {
    //Get infor from form at FE 
    let flag = await mess_db.findAllRoomOf1User(req.jwtDecoded.data?.id, req.jwtDecoded.data?.role);
    if (flag){
        const sortedActivities = flag.sort((a, b) => b.create_time - a.create_time);
        return res.status(200).json(sortedActivities);
    }
    return res.json([]);
}