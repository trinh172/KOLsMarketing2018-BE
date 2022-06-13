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

    async countJobOf1User(iduser, role){
        const item = await db('job_member').where({
            id_user: iduser,
            role: role
        });
        
        return item.length;
    },

    async countPostOfBrandPerMonth(id_brand){
        const query_raw = `select extract(month from write_time) as mon,
                                    extract(year from write_time) as yyyy,
                                    COUNT(id) as total
                            from posts
                            where id_writer = ${id_brand}
                            group by 1,2`
        const item = await db.raw(query_raw);
        //console.log(item);
        
        return item?.rows;
    },

    async countRecruitmentOfBrand(idbrand){
        const item = await db('recruitment').where({
            id_brands: idbrand
        });
        
        return item.length;
    },

    async countKOLWorkWithBrand(idbrand){
        //get all post id of brand
        const id_post = await db.select("id").from("posts").where("id_writer", idbrand);
        let values = [];
        if (id_post.length > 0){
            values = id_post.map(({ id }) => id);
        }
        else{
            return [];
        }
        console.log("value: ", values)
        let item = await db.select("id_user").from('job_member').where('id_post', 'in', values).andWhere('role', '1');
        return item;
    },

    async countJobOf1User(iduser, role){
        const item = await db('job_member').where({
            id_user: iduser,
            role: role
        });
        
        return item.length;
    },

    async countPostSocialAndDraftOf1Kol(id_kol){
        try {
            let today = moment().add(7, 'hours');

            let publish_post_done = await db('kol_social_post').where({
                id_kol: id_kol,
            }).andWhere('schedule_time', '<=', today).whereNot("type_schedule", "0");

            let items = await db('kol_social_post').where({
                id_kol: id_kol,
                state: '0'
            });

            let publish_post_waiting = await db('kol_social_post').where({
                id_kol: id_kol,
            }).andWhere('schedule_time', '>', today).whereNot("type_schedule", "0");
            return {
                post_done: publish_post_done.length,
                post_schedule: publish_post_waiting.length,
                post_draft: items.length
            };
        } catch (e) {
            console.log(e);
            return null;
        }
    },

    async countNumberOfBrandLikeKol(id_kol){
        try {

            let result = await db('brands_like_kols').where({
                id_kol: id_kol,
            });
            return result.length;
        } catch (e) {
            console.log(e);
            return 0;
        }
    },

    async countNumberOfBrandKolLike(id_kol){
        try {

            let result = await db('kols_like_brands').where({
                id_kol: id_kol,
            });
            return result.length;
        } catch (e) {
            console.log(e);
            return 0;
        }
    },

    
    async countNumberOfKolBrandLike(id_brand){
        try {

            let result = await db('brands_like_kols').where({
                id_brand: id_brand,
            });
            return result.length;
        } catch (e) {
            console.log(e);
            return 0;
        }
    },

    
    async countNumberOfKolLikeBrand(id_brand){
        try {

            let result = await db('kols_like_brands').where({
                id_brand: id_brand,
            });
            return result.length;
        } catch (e) {
            console.log(e);
            return 0;
        }
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
            }).orderBy("create_time","desc");
            const n = items.length;
            let temp_count = 0;
            while (temp_count < n){
                items[temp_count].stt = temp_count + 1;
                items[temp_count].create_time = moment(items[temp_count].create_time).format("DD/MM/YYYY HH:mm");
                items[temp_count].post_info = await this.getPostTitle(items[temp_count].id_post_job);
                temp_count = temp_count + 1;
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
            let tempcount = 0;
            const n = publish_post_done.length;
            while(tempcount < n){
                publish_post_done[tempcount].schedule_time = moment(publish_post_done[tempcount].schedule_time).format("DD/MM/YYYY HH:mm");
                publish_post_done[tempcount].page_name = await this.getPageNameByPageSocialID(publish_post_done[tempcount].id_page_social);
                publish_post_done[tempcount].post_info = await this.getPostTitle(publish_post_done[tempcount].id_post_job);
                tempcount = tempcount + 1;
            }
            if (publish_post_done)
                return publish_post_done;
            return [];
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async getListPublishPostDoneInJob(id_kol, id_post) {
        try {
            let today = moment().add(7, 'hours');

            let publish_post_done = await db('kol_social_post').where({
                id_kol: id_kol,
                id_post_job: id_post
            }).andWhere('schedule_time', '<=', today).whereNot("type_schedule", "0").orderBy('schedule_time', 'desc');
            //console.log("publish_post_done: ", publish_post_done)
            if (publish_post_done)
                return publish_post_done;
            return [];
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
            return [];
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

}