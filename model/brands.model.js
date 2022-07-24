const db = require('../utils/connectDB')
const moment = require('moment');
const { updatePasswordByEmail } = require('./kols.model');
module.exports = {
    async all(){
        let items = await db('brands');
        let temp = 0;
        while(temp < items.length){
            items[temp].create_time = moment(items[temp].create_time).format("DD/MM/YYYY HH:mm");
            items[temp].password = 'has-password';
            temp = temp + 1;
        }
        return items
    },

    async getKolInfo(ID){
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

    async getBrandsProfileAndCountPost(ID){
        let items = await db('brands').where('id', ID);
        let count_post = await db('posts').where('id_writer', ID);
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
        items[0].count_posts = count_post.length;
        return items[0];
    },

    async kolsGetBrandInfo(ID, id_kol){
        if(id_kol){
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
            let like = await db('kols_like_brands')
                .where({
                    'id_kol': id_kol,
                    'id_brand':  ID,
                });
            if(like.length > 0)
                items[0].likeBrand = true;
            else items[0].likeBrand = false;
            let count_followers = await db('kols_like_brands')
                                        .where({
                                            'id_brand':  ID,
                                        });
            items[0].count_followers = count_followers.length;
            return items[0];
        }
        let items = await db('brands').where('id', ID);
        if (items.length==0)
            return null;
        items[0].password = 'has-password';
        items[0].likeBrand = false;
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
        let count_followers = await db('kols_like_brands')
                                        .where({
                                            'id_brand':  ID,
                                        });
        items[0].count_followers = count_followers.length;
        return items[0];
    },

    async getListBrands(){
        let item = await db('brands');
        if (item.length==0)
            return null;
        let items = [];
        let tempcount = 0;
        const n = item.length;
        while(tempcount < n){
            let result = {};
            result.introduce = item[tempcount].introduce;
            result.brand_name = item[tempcount].brand_name;
            result.id = item[tempcount].id;
            result.avatar = item[tempcount].avatar;
            result.cover = item[tempcount].cover;
            result.likeBrand = false;
            let count_followers = await db('kols_like_brands')
                                        .where({
                                            'id_brand':  item[tempcount].id,
                                        });
            result.count_followers = count_followers.length;
            let count_posts = await db('posts').where({
                                                    'id_writer':  item[tempcount].id,
                                                    'status': '1'
                                                });
            result.count_posts = count_posts.length;
            items.push(result);
            tempcount = tempcount + 1;
        }
        return items;
    },

    async getListBrandsLikeInfo(idkol){
        let item = await db('brands');
        if (item.length==0)
            return null;
        let items = [];
        let tempcount = 0;
        const n = item.length;
        while (tempcount < n){
            let result = {};
            result.introduce = item[tempcount].introduce;
            result.brand_name = item[tempcount].brand_name;
            result.id = item[tempcount].id;
            result.avatar = item[tempcount].avatar;
            result.cover = item[tempcount].cover;
            let count_followers = await db('kols_like_brands')
                                        .where({
                                            'id_brand':  item[tempcount].id,
                                        });
            result.count_followers = count_followers.length;
            let count_posts = await db('posts').where({
                                            'id_writer':  item[tempcount].id,
                                            'status': '1'
                                        });
            result.count_posts = count_posts.length;
            let like = await db('kols_like_brands')
                .where({
                    'id_kol': idkol,
                    'id_brand':  item[tempcount].id,
                });
            if(like.length > 0)
                result.likeBrand = true;
            else result.likeBrand = false;
            items.push(result);
            tempcount = tempcount + 1;
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
    async updateGender(gender, id){
        try {
            await db('brands').where('id', id).update({'gender': gender});
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

    async updateOTPByEmailBrands(email, OTP){
        try {
            await db('brands').where('email', email).update({'otp': OTP});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateOTPByIDBrands(id_user, OTP){
        try {
            await db('brands').where('id', id_user).update({'otp': OTP});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
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

    async updatePasswordByEmail(email, password){
        try {
            await db('brands').where('email', email).update({'password': password});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

     //Find all brands that user like, sap xep theo thu tu ma user like
     async findAllKolsBrandLike(id_brand) {
        const rows = await db('brands_like_kols')
            .where({
                id_brand: id_brand,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.getKolInfo(rows[tempcount].id_kol);
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    async brandLikeKol(id_brand, id_kol) {
        try {
            await db('brands_like_kols').insert({
                'id_brand': id_brand,
                'id_kol': id_kol
            })
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async brandUnlikeKol(id_brand, id_kol) {
        try {
            await db('brands_like_kols').where({
                'id_brand': id_brand,
                'id_kol': id_kol
            }).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}