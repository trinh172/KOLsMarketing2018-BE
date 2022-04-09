//import { Server, Socket } from "socket.io";
const moment = require('moment');
var app = require('express');
var router = app.Router();
const kols_db = require("../model/kols.model");
const brands_db = require("../model/brands.model");
const jwtHelper = require("../utils/jwt.helper");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
let onlineUsers = [];

module.exports = function(io) {
    const addNewUser = (id, role, socketId) => {
        removeDupUser(id, role);
        onlineUsers.push({ id, role, socketId });
    };

    const removeDupUser = (id, role) => {
        onlineUsers = onlineUsers.filter((user) => user.id !== id && user.role !== role);
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
                console.log('onlineUsers update', onlineUsers);
            }
            
        });


        socket.on("disconnect", () => {
            console.log('disconnect socket: ', socket.id);
            removeUser(socket.id);
        });
    });

    return router;
}