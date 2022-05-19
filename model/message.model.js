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

        return null;
    },

    async findRoomByID(id_room){
        const items = await db('room').where({
            id: id_room
        }); 

        if (items.length > 0)
          return items[0];

        return null;
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
            item.id_room = case1[i].id;
            if(case1[i].role2 == 1){
                let userInfo = await this.getUserInfo(case1[i].id_user2, 1)
                let state = await db("check_read_room").where({
                    id_room: case1[i].id,
                    id_user: user,
                    role: role
                })
                item.state = state[0].state;
                item.userInfo = userInfo;
                item.create_time = case1[i].time;
            }
            if(case1[i].role2 == 2){
                let userInfo = await this.getUserInfo(case1[i].id_user2, 2)
                item.userInfo = userInfo;
                let state = await db("check_read_room").where({
                    id_room: case1[i].id,
                    id_user: user,
                    role: role
                })
                item.state = state[0].state;
                item.create_time = case1[i].time;
            }
            result.push(item);
        }
        for(i=0; i<case2.length; i++){
            let item = {};
            item.id_room = case2[i].id;
            if(case2[i].role1 == 1){
                let userInfo = await this.getUserInfo(case2[i].id_user1, 1)
                item.userInfo = userInfo;
                let state = await db("check_read_room").where({
                    id_room: case2[i].id,
                    id_user: user,
                    role: role
                })
                item.state = state[0].state;
                item.create_time = case2[i].time;
            }
            if(case2[i].role1 == 2){
                let userInfo = await this.getUserInfo(case2[i].id_user1, 2)
                item.userInfo = userInfo;
                let state = await db("check_read_room").where({
                    id_room: case2[i].id,
                    id_user: user,
                    role: role
                })
                item.state = state[0].state;
                item.create_time = case2[i].time;
            }
            result.push(item);
        }

        if (result.length > 0)
          return result;
        return [];
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
            console.log("nay la trong model add room: ", user1, role1, user2, role2)
            await db('room').insert({
                id_user1: user1,
                role1: role1,
                id_user2: user2,
                role2: role2,
                time: moment().add(7, 'hours')
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async add_check_read_room(idroom, iduser, role){
        try {
            await db('check_read_room').insert({
                id_room: idroom,
                id_user: iduser,
                role: role
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async addMessage(newMessage){
        try {
            await db('message').insert(newMessage);
            await db('room').where("id", newMessage.id_room).update({
                "time": newMessage.create_time
            });
            await db('check_read_room').where({
                "id_room": newMessage.id_room,
                "id_user": newMessage.id_user,
                "role": newMessage.role
            }).update("state", 1);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateCheckReadRoom(idroom, user, role, state){
        try {
            await db('check_read_room').where({
                "id_room": idroom,
                "id_user": user,
                "role": role
            }).update("state", state);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
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