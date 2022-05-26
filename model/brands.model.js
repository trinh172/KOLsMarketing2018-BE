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

        items[0].bio_url = [];
        let bio = await db("bio_url").where({
            id_user: ID,
            role: '2'
        });
        if(bio.length > 0){
            for(i = 0; i< bio.length; i++){
                items[0].bio_url.push(bio[i].url);
            }
        };
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
            result.introduce = item[i].introduce;
            result.brand_name = item[i].brand_name;
            result.id = item[i].id;
            result.avatar = item[i].avatar;
            result.cover = item[i].cover;
            result.likeBrand = false;
            items.push(result);
        }
        return items;
    },

    async getListBrandsLikeInfo(idkol){
        let item = await db('brands');
        if (item.length==0)
            return null;
        let items = []
        for(i = 0; i < item.length; i++){
            let result = {};
            result.introduce = item[i].introduce;
            result.brand_name = item[i].brand_name;
            result.id = item[i].id;
            result.avatar = item[i].avatar;
            result.cover = item[i].cover;
            let like = await db('kols_like_brands')
                .where({
                    'id_kol': idkol,
                    'id_brand':  item[i].id,
                });
            if(like.length > 0)
                result.likeBrand = true;
            else result.likeBrand = false;
            items.push(result);
        }
        return items;
    },

    async updateFullname(fullname, id){
        try {
            await db('brands').where('id', id).update({'full_name': fullname});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateIntroduce(introduce, id){
        try {
            await db('brands').where('id', id).update({'introduce': introduce});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateBrandname(brandname, id){
        try {
            await db('brands').where('id', id).update({'brand_name': brandname});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateAddress(address, id){
        try {
            await db('brands').where('id', id).update({'address': address});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updatePhone(phone, id){
        try {
            await db('brands').where('id', id).update({'phone': phone});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateEmail(email, id){
        try {
            await db('brands').where('id', id).update({'email': email});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateAvatar(url_avatar, id){
        try {
            await db('brands').where('id', id).update({
                avatar: url_avatar
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateCover(url_cover, id){
        try {
            await db('brands').where('id', id).update({
                cover: url_cover
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    async updateBioLink(array_url, id){
        try {
            //delete all old images
            await db('bio_url').where({
                id_user: id,
                role: 2,
                type: 1
            }).del();

            //insert new images
            for (i = 0; i < array_url.length; i++){
                await db('bio_url').insert({
                    id_user: id,
                    role: 2,
                    type: 1,
                    url: array_url[i]
                })
            }
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

    async updatePassword(id, password){
        try {
            await db('brands').where('id', id).update({'password': password});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}