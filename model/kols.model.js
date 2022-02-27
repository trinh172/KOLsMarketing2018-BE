const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('kols');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },

    async findKOLsByID(ID){
        let items = await db('kols').where('id', ID);
        if (items.length==0)
            return null;
        return items[0];
    },

    async findKOLsByEmail(email){
        let items = await db('kols').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },

    async createKOLs(user) {
        try {
            await db('kols').insert(user)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    updateOTPByEmailKOLs(email, OTP){
        return db('kols').where('email', email).update({'otp': OTP});
    },

    updateOTPByIDKOLs(id_user, OTP){
        return db('kols').where('id', id_user).update({'otp': OTP});
    },

    updatePassword(email, password){
        return db('kols').where('email', email).update({'password': password});
    }
}