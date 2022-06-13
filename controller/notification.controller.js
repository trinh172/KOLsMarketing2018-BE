const noti_db = require('../model/nofitications.model');
const moment = require('moment');

exports.getAllNotificationsOf1User = async function(req, res) {
    let list_noti = await noti_db.getAllNotificationOfIDUser(req.jwtDecoded.data.id, req.jwtDecoded.data.role)
    if(list_noti){
        return res.status(200).json(list_noti);
    }
    return res.status(404).json(false);
}

exports.mark1NotiRead = async function(req, res) {
    let markread = await noti_db.updateStatusOf1Noti(req.body?.id_noti, '1')
    if(markread){
        return res.status(200).json(true);
    }
    return res.status(404).json(false);
}
exports.markAllNotiDone = async function(req, res) {
    let markread = await noti_db.markAllNotiStatusOf1UserDone(req.jwtDecoded.data?.id, req.jwtDecoded.data?.role, '1')
    if(markread){
        return res.status(200).json(true);
    }
    return res.status(404).json(false);
}
