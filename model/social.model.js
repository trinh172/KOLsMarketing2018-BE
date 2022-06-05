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

    async getPostTitle(idpost){
        const item = await db('posts').where({
            id: idpost
        });
        if(item.length>0){
            return item[0].title;
        }
        return '';
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

    async getPageNameByPageSocialID(id_page_social) {
        try {
            let items = await db('kol_social_page').where({
                "id_page_social": id_page_social
            });
            if(items.length > 0)
                return items[0].page_name;
            else return '';
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getListPageSecurityByIDKols(id_kol) {
        try {
            let today = moment().add(7, 'hours');
            let items = await db('kol_social_page').where({
                "id_kol": id_kol,
                "state": "1",
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

    async getListDraftOfKol(id_kol) {
        try {
            let items = await db('kol_social_post').where({
                id_kol: id_kol,
                state: '0'
            });
            for( i = 0; i < items.length; i++){
                items[i].stt = i + 1;
                items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm");
                items[i].post_info = await this.getPostTitle(items[i].id_post_job)
            }
            if (items)
                return items;
            return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getListPublishPostDone(id_kol) {
        try {
            let today = moment().add(7, 'hours');

            let publish_post_done = await db('kol_social_post').where({
                id_kol: id_kol,
            }).andWhere('schedule_time', '<=', today).whereNot("type_schedule", "0").orderBy('schedule_time', 'desc');
            //console.log("publish_post_done: ", publish_post_done);
            for( i = 0; i < publish_post_done.length; i++){
                publish_post_done[i].schedule_time = moment(publish_post_done[i].schedule_time).format("DD/MM/YYYY HH:mm");
                publish_post_done[i].page_name = await this.getPageNameByPageSocialID(publish_post_done[i].id_page_social);
                publish_post_done[i].post_info = await this.getPostTitle(publish_post_done[i].id_post_job)
            }
            if (publish_post_done)
                return publish_post_done;
            return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getListPostScheduleWaiting(id_kol) {
        try {
            let today = moment().add(7, 'hours');

            let publish_post_waiting = await db('kol_social_post').where({
                id_kol: id_kol,
            }).andWhere('schedule_time', '>', today).whereNot("type_schedule", "0").orderBy('schedule_time', 'desc');
            //console.log("publish_post_waiting: ", publish_post_waiting);
            for( i = 0; i < publish_post_waiting.length; i++){
                publish_post_waiting[i].schedule_time = moment(publish_post_waiting[i].schedule_time).format("DD/MM/YYYY HH:mm");
                publish_post_waiting[i].page_name = await this.getPageNameByPageSocialID(publish_post_waiting[i].id_page_social);
                publish_post_waiting[i].post_info = await this.getPostTitle(publish_post_waiting[i].id_post_job)
            }
            if (publish_post_waiting)
                return publish_post_waiting;
            return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getUserSocialInfoSecurity(id_kol) {
        try {
            let today = moment().add(7, 'hours');
            let items = await db('kol_social_account').where({"id_kol": id_kol, "state": '1'}).andWhere('time_expired', '>=', today);
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

    async updateStateUserAccount(state, id_kol) {
        try {
            let items = await db('kol_social_account').where({"id_kol": id_kol}).update('state', state);
            
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateStatePageAccount(state, id_kol) {
        try {
            let items = await db('kol_social_page').where({"id_kol": id_kol}).update('state', state);
            
            return true;
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

    async getDraftPostByCreateTimeIdKol(create_time, id_kol) {
        try {
            let items = await db('kol_social_post').where({
                create_time: create_time,
                id_kol: id_kol,
            });
            if (items.length > 0)
                return items[0];
            return null;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getDraftPostByID(id) {
        try {
            let items = await db('kol_social_post').where({
                id: id,
            });
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

    async updatePostByID(id, newupdate) {
        try {
            let items = await db('kol_social_post').where("id", id).update(newupdate);
            return items;
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

    async deletePostByID(id){
        try {
            await db('kol_social_post').where("id", id).del();
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