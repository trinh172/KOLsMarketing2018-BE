const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('brands');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },

    async findBrandsByID(ID){
        let items = await db('brands').where('id', ID);
        if (items.length==0)
            return null;
        return items[0];
    },

    async findBrandsByEmail(email){
        let items = await db('brands').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },
    
    async createBrands(user) {
        try {
            await db('brands').insert(user)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    updateOTPByEmailBrands(email, OTP){
        return db('brands').where('email', email).update({'otp': OTP});
    },

    updateOTPByIDBrands(id_user, OTP){
        return db('brands').where('id', id_user).update({'otp': OTP});
    },

    updatePassword(email, password){
        return db('brands').where('email', email).update({'password': password});
    }
}