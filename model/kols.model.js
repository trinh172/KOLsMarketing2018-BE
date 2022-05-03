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

    async getKOLsProfile(ID){
        let items = await db('kols').where('id', ID);
        if (items.length==0)
            return null;
        items[0].password = 'has-password';
        items[0].avatar = '';
        let url_avatar = await db("image_user").where({
            id_user: ID,
            role: '1',
            type: 1
        });
        if(url_avatar.length > 0){
            items[0].avatar = url_avatar[0].url;
        };

        if (items[0].address != null){
            let address = await db("vn_tinhthanhpho").where({
                id: items[0].address
            });
            if(address.length > 0){
                items[0].address = address[0].name;
            };
        }
        
        items[0].create_time = moment(items[0].create_time).format("DD/MM/YYYY HH:mm:ss");
        items[0].role = '1';
        
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