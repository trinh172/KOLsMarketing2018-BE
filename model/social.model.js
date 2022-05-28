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
                result.avatar = item[0].avatar;
                result.cover = item[0].cover;
                result.role = '2';
                return result
            }
        }
        return null;
    },
    async getListPageByIDKols(id_kol) {
        try {
            let items = await db('kol_social_page').where("id_kol", id_kol);
            return items;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getPageAccessByIDpageKol(id_kol, id_page_social) {
        try {
            let items = await db('kol_social_page').where({
                "id_kol": id_kol,
                "id_page_social": id_page_social
            });
            if(items.length > 0)
                return items[0].page_token;
            else return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getListPageSecurityByIDKols(id_kol) {
        try {
            let today = moment();
            let items = await db('kol_social_page').where({
                "id_kol": id_kol,
            }).andWhere('time_expired', '>=', today);
            let result = [];
            for (i = 0; i < items.length; i++){
                let item = {};
                item.page_name = items[i].page_name;
                item.id_page_social = items[i].id_page_social;
                item.id = items[i].id;
                result.push(item);
            }
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getUserSocialInfoSecurity(id_kol) {
        try {
            let today = moment();
            let items = await db('kol_social_account').where("id_kol", id_kol).andWhere('time_expired', '>=', today);
            let result = [];
            for (i = 0; i < items.length; i++){
                let item = {};
                item.account_name = items[i].account_name;
                item.id_kol = items[i].id_kol;
                item.id_user_social = items[i].id_user_social;
                item.time_expired = items[i].time_expired;
                result.push(item);
            }
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getSocialByPostSocialID(id_post_social) {
        try {
            let items = await db('kol_social_post').where("id_post_social", id_post_social);
            if (items.length > 0)
                return items[0];
            return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async saveUserAccount(user) {
        try {
            let checkExist = await db("kol_social_account").where("id_kol", user.id_kol);
            if (checkExist.length > 0){
                let items = await db('kol_social_account').where("id_kol", user.id_kol).update(user);
                return items;
            }
            else {
                let items = await db('kol_social_account').insert(user);
                return items;
            }
            
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async savePageAccount(page) {
        try {
            let checkExist = await db("kol_social_page").where({
                "id_page_social": page.id_page_social,
                "id_user_account": page.id_user_account
            });
            if (checkExist.length > 0){
                let items = await db('kol_social_page').where({
                    "id_page_social": page.id_page_social,
                    "id_user_account": page.id_user_account
                }).update(page);
                return items;
            }
            else {
                let items = await db('kol_social_page').insert(page);
                return items;
            }
            
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async addNewPostSocial(post) {
        try {
            let items = await db('kol_social_post').insert(post);
            return items;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async delete_job(id_job){
        try {
            await db('job_describe').where("id", id_job).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async delete_member(id_post, id_user, role){
        try {
            await db('job_member').where({
                'id_post': id_post,
                'id_user': id_user,
                'role': role
            }).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}