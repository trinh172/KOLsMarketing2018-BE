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

    async getBrandsProfile(ID){
        let items = await db('brands').where('id', ID);
        if (items.length==0)
            return null;
        items[0].password = 'has-password';
        items[0].detail_images = [];
        let url_detail = await db("image_user").where({
            id_user: ID,
            role: '2',
            type: 2
        });
        if(url_detail.length > 0){
            for(i = 0; i< url_detail.length; i++){
                items[0].detail_images.push(url_detail[i].url);
            }
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
        items[0].role = '2';
        
        return items[0];
    },

    async getListBrands(){
        let item = await db('brands');
        if (item.length==0)
            return null;
        let items = []
        for(i = 0; i < item.length; i++){
            let result = {};
            result.introduce = item[0].introduce;
            result.brand_name = item[0].brand_name;
            result.id = item[0].id;
            result.avatar = item[0].avatar;
            result.cover = item[0].cover;
            items.push(result);
        }
        return items;
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