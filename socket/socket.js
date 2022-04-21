//import { Server, Socket } from "socket.io";
const moment = require('moment');
var app = require('express');
var router = app.Router();
const kols_db = require("../model/kols.model");
const brands_db = require("../model/brands.model");
const mess_db = require("../model/message.model");
const jwtHelper = require("../utils/jwt.helper");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
let onlineUsers = [];

module.exports = function(io) {
    const addNewUser = (id, role, socketId) => {
        removeDupUser(id, role);
        onlineUsers.push({ id, role, socketId });
    };

    const removeDupUser = (id, role) => {

        let dup = onlineUsers.filter((user) => user.id == id && user.role == role);
        console.log("Dup user socket: ", dup)
        if(dup.length > 0){
            removeUser(dup[0].socketId);
        }
        
    };

    const removeUser = (socketID) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketID);
    };

    const getUser = (id, role ) => {
        return onlineUsers.find((user) => user.id === id && user.role === role);
    };


    const tokenToUser = async (token) => {
        decodedToken = await jwtHelper.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('decodedToken', decodedToken);
        data_result = {};
        if(decodedToken.data.role == 1){
            data_result.user = await kols_db.findKOLsByID(decodedToken.data.id);
            data_result.role = 1;
            return data_result;
        }
        if(decodedToken.data.role == 2){
            data_result.user = await brands_db.findBrandsByID(decodedToken.data.id);
            data_result.role = 2;
            return data_result;
        }
    }

    io.on("connection", async (socket) => {
        console.log('Connection established socket');
        console.log('OnlineUser', onlineUsers);
        //socket io for user
        socket.on('newUser', async (access_token) => {
            console.log('socket newUser token: ', access_token);
            if(access_token!= null){
                decoded_user = await tokenToUser(access_token);
                console.log('socket decoded_user', decoded_user);
                console.log('onlineUsers old', onlineUsers);
                if(decoded_user.role == 2){
                    addNewUser(decoded_user.user?.id, "brands", socket.id);
                }
                if(decoded_user.role == 1){
                    addNewUser(decoded_user.user?.id, "kols", socket.id);
                }
                //User login sẽ tham gia phòng chat
                /*
                let list_room = await mess_db.findAllRoomOf1User(decoded_user.user?.id, decoded_user.role);
                for(i = 0; i<list_room.length; i++){
                    let name = "room" + list_room[i].id;
                    socket.join(name);
                }*/
                console.log('onlineUsers update', onlineUsers);
            }
            
        });
        //bên kia sẽ emit("sendChat", {access_token, iduser, role, content}); iduser là người sẽ nhận tin, role dạng kols, brands
        socket.on('sendChat', async ({access_token, idroom, iduser, role, content}) => {
            console.log('Socket sendChatFromUser');
            const decoded_user = await tokenToUser(access_token);
            console.log('socket decoded_user', decoded_user);
            const create_time = moment().add(7, 'hours');
            let new_message = {
                id_room: idroom,
                id_user: decoded_user.user?.id,
                role: decoded_user.role,
                content: content,
                create_time: create_time
            }
            console.log('new message', new_message);

            await mess_db.addMessage(new_message);
            
            receiver = getUser(iduser, role);
            if (receiver){
                let added_message = await mess_db.getMessageByIdroomCreatetime(idroom,create_time);
                io.to(receiver.socketId).emit("getNewMessage", added_message);
            }

        })

        socket.on("disconnect", () => {
            console.log('disconnect socket: ', socket.id);
            removeUser(socket.id);
        });
    });

    return router;
}