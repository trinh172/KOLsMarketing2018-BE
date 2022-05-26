const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {

    async getBrandInfo(iduser){
        const item = await db('brands').where({
            id: iduser
        });
        if(item.length>0){
            let result = {};
            result.email = item[0].email;
            result.introduce = item[0].introduce;
            result.phone = item[0].phone;
            result.name = item[0].brand_name;
            result.id = item[0].id;
            result.avatar = item[0].avatar;
            result.cover = item[0].cover;
            result.address = item[0].address;
            result.role = '2';
            return result
        }
    
        return null;
    },

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
        items[0].detail_images = [];
        let url_detail = await db("image_user").where({
            id_user: ID,
            role: '1',
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
        items[0].bio_url = [];
        let bio = await db("bio_url").where({
            id_user: ID,
            role: '1'
        });
        if(bio.length > 0){
            for(i = 0; i< bio.length; i++){
                items[0].bio_url.push(bio[i].url);
            }
        };
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

    async addBioUrl(bio_url, id){
        try {
            //insert new images
            await db('bio_url').insert({
                id_user: id,
                role: 1,
                type: 1,
                url: bio_url
            })
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

     //Find all brands that user like, sap xep theo thu tu ma user like
     async findAllBrandsKolsLike(idkol) {
        const rows = await db('kols_like_brands')
            .where({
                id_kol: idkol,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.getBrandInfo(rows[tempcount].id_brand);
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    async kolsLikeBrand(id_kol, id_brand) {
        try {
            await db('kols_like_brands').insert({
                'id_brand': id_brand,
                'id_kol': id_kol
            })
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async kolsUnlikeBrand(id_kol, id_brand) {
        try {
            await db('kols_like_brands').where({
                'id_brand': id_brand,
                'id_kol': id_kol
            }).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    async updateFullname(fullname, id){
        try {
            await db('kols').where('id', id).update({'full_name': fullname});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateDescription(des, id){
        try {
            await db('kols').where('id', id).update({'introduce': des});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateInfo(new_info, id){
        try {
            await db('kols').where('id', id).update({
                birthday: new_info.birth,
                gender: new_info.gender,
                phone: new_info.phone,
                email: new_info.mail,
                address: new_info.address
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateAvatar(url_avatar, id){
        try {
            await db('kols').where('id', id).update({
                avatar: url_avatar
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateImageDetail(array_url, id){
        try {
            //delete all old images
            await db('image_user').where({
                id_user: id,
                role: 1,
                type: 2
            }).del();

            //insert new images
            for (i = 0; i < array_url.length; i++){
                await db('image_user').insert({
                    id_user: id,
                    role: 1,
                    type: 2,
                    url: array_url[i]
                })
            }
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
                role: 1,
                type: 1
            }).del();

            //insert new images
            for (i = 0; i < array_url.length; i++){
                await db('bio_url').insert({
                    id_user: id,
                    role: 1,
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

    updateOTPByEmailKOLs(email, OTP){
        return db('kols').where('email', email).update({'otp': OTP});
    },

    updateOTPByIDKOLs(id_user, OTP){
        return db('kols').where('id', id_user).update({'otp': OTP});
    },

    async updatePassword(id, password){
        try {
            await db('kols').where('id', id).update({'password': password});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async deleteBioUrl(bio_url, id){
        try {
            //insert new images
            await db('bio_url').where({
                id_user: id,
                role: 1,
                url: bio_url
            }).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}