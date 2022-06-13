const db = require('../utils/connectDB')
const moment = require('moment');

module.exports = {
    async getUserInfo(iduser, role){
        if(role == 1){
            const item = await db('kols').where({
                id: iduser
            });
            if(item.length>0){
                let result = {};
                result.email = item[0].email;
                result.name = item[0].full_name;
                result.id = item[0].id;
                result.avatar = item[0].avatar;
                result.role = '1';
                return result
            }
        }
        if(role == 2){
            const item = await db('brands').where({
                id: iduser
            });
            if(item.length>0){
                let result = {};
                result.email = item[0].email;
                result.name = item[0].brand_name;
                result.id = item[0].id;
                result.cover = item[0].cover;
                result.avatar = item[0].avatar;
                result.role = '2';
                return result
            }
        }
        return null;
    },

    async createNotification(new_noti){
        try {
            await db('notifications').insert(new_noti);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getAllNotificationOfIDUser(id_user, role){
        try {
            const list_items = await db('notifications').where({
                                            id_user: id_user,
                                            role: role
                                        }).orderBy('create_time', 'desc');
            return list_items
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async findNotiByID(id){
        try {
            const noti = await db('notifications').where({
                id: id
            });
            return noti
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateStatusOf1Noti(id, newStatus){
        try {
            const noti = await db('notifications').where({
                id: id
            }).update("status", newStatus);
            return noti
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async markAllNotiStatusOf1UserDone(id_user, role, newStatus){
        try {
            const noti = await db('notifications').where({
                id_user: id_user,
                role: role, 
                status: '0'
            }).update("status", newStatus);
            return noti
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}