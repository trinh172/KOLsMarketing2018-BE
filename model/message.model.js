const db = require('../utils/connectDB')
const moment = require('moment');

module.exports = {
    async findRoomBy2User(user1, role1, user2, role2){
        const case1 = await db('room').where({
            id_user1: user1,
            role1: role1,
            id_user2: user2,
            role2: role2
        });
        const case2 = await db('room').where({
            id_user1: user2,
            role1: role2,
            id_user2: user1,
            role2: role1
        });

        if (case1.length > 0)
          return case1[0];
        
        if (case2.length > 0)
          return case2[0];

        return false;
    },

    async findAllRoomOf1User(user, role){
        const case1 = await db('room').where({
            id_user1: user,
            role1: role
        });
        const case2 = await db('room').where({
            id_user2: user,
            role2: role
        });
        let result = [];
        for(i=0; i<case1.length; i++){
            let item = {};
            item.id = case1[i].id;
            if(case1[i].role2 == 1){
                let userInfo = await db('kols').where({
                    id: case1[i].id_user2
                });
                item.userInfo = userInfo[0];
            }
            if(case1[i].role2 == 2){
                let userInfo = await db('brands').where({
                    id: case1[i].id_user2
                });
                item.userInfo = userInfo[0];
            }
            result.push(item);
        }
        for(i=0; i<case2.length; i++){
            let item = {};
            item.roomid = case2[i].id;
            if(case2[i].role1 == 1){
                let userInfo = await db('kols').where({
                    id: case2[i].id_user1
                });
                item.userInfo = userInfo[0];
            }
            if(case2[i].role1 == 2){
                let userInfo = await db('brands').where({
                    id: case2[i].id_user1
                });
                item.userInfo = userInfo[0];
            }
            result.push(item);
        }

        if (result.length > 0)
          return result;
        return null;
    },

    async getMessageInRoom(roomid){
        const list_message = await db('message').where({
            id_room: roomid
        });
        if (list_message.length > 0)
          return list_message;
        return null;
    },

    async addRoom2User(user1, role1, user2, role2){
        try {
            db('room').insert({
                id_user1: user1,
                role1: role1,
                id_user2: user2,
                role2: role2
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async addMessage(newMessage){
        try {
            db('message').insert(newMessage);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async getUserInfo(iduser, role){
        if(role == 1){
            const item = await db('kols').where({
                id: iduser
            });
            if(item.length>0)
                return item[0]
        }
        if(role == 2){
            const item = await db('brands').where({
                id: iduser
            });
            if(item.length>0)
                return item[0]
        }
        return null;
    },
    async messageByIDRoom(idroom){
        let items = await db('message').where('id_room', idroom);
        for (let i = 0; i < items.length; i++){
            items[i].userInfo = await this.getUserInfo(items[i].id_user, items[i].role);
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items;
    },

    async getMessageByIdroomCreatetime(idroom, create_time){
        let items = await db('message').where({
            'id_room': idroom,
            create_time: create_time
        });
        if (items.length===0) 
            return null;
        let item = items[0];
        item.userInfo = await this.getUserInfo(item.id_user, item.role);
        item.create_time = moment(item.create_time).format("DD/MM/YYYY HH:mm:ss");
        return item;
    },
}