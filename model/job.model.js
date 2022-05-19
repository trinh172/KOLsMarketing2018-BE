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
    async create_job_describe(new_job) {
        try {
            await db('job_describe').insert(new_job)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async create_job_comment(new_comment) {
        try {
            await db('job_comment').insert(new_comment)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async create_job_member(new_member) {
        try {
            await db('job_member').insert(new_member)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    async findJobByBrandCreatetime(iduser, create_time){
        let items = await db('recruitment').where({
            'id_brand': iduser,
            'create_time': create_time
        });
        if (items.length==0)
            return null;
        return items[0];
    },

    async findCommentByUserCreatetime(iduser, role, create_time){
        let items = await db('recruitment').where({
            'id_user': iduser,
            'role': role,
            'create_time': create_time
        });
        if (items.length==0)
            return null;
        return items[0];
    },

    async findJobByPostID(id_post){
        let items = await db('job_describe').where({
            'id_post': id_post
        });
        if (items.length==0)
            return null;
        for (i = 0; i < items.length; i++){
            items[i].userInfo = await this.getUserInfo(items[i].id_brand, 2);
        }
        return items;
    },

    async findCommentByPostID(id_post){
        let items = await db('job_comment').where({
            'id_post': id_post
        });
        if (items.length==0)
            return null;

        for (i = 0; i < items.length; i++){
            items[i].userInfo = await this.getUserInfo(items[i].id_user, items[i].role);
        }
        return items;
    },

    async findMemberByPostID(id_post){
        let items = await db('job_member').where({
            'id_post': id_post
        });
        if (items.length==0)
            return null;
        for (i = 0; i < items.length; i++){
            items[i].userInfo = await this.getUserInfo(items[i].id_user, role);
        }
        return items;
    },

    async markDoneJob(id_post, id_kol){
        try {
            await db('job_member').where({
                'id_post': id_post,
                'id_user': id_kol,
                'role':1
            })
            .update({
                'state': 2
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async markNotDoneJob(id_post, id_kol){
        try {
            await db('job_member').where({
                'id_post': id_post,
                'id_user': id_kol,
                'role':1
            })
            .update({
                'state': 1
            });
            return true
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