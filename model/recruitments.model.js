const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async create_recruitment(new_recruit) {
        try {
            await db('recruitment').insert(new_recruit)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
    async findRecruitmentBykolscreatetime(iduser, create_time){
        let items = await db('recruitment').where({
            'id_kols': iduser,
            'create_time': create_time
        });
        if (items.length==0)
            return null;
        return items[0];
    },

    async findRecruitmentByPostID(id_post){
        let items = await db('recruitment').where({
            'id_post': id_post
        });
        if (items.length==0)
            return null;
        return items;
    },

    async findRecruitmentByRecruitID(id_recruit){
        let items = await db('recruitment').where({
            'id': id_recruit
        });
        if (items.length==0)
            return null;
        return items[0];
    },

    async acceptRecruitment(id_recruit){
        try {
            await db('recruitment').where({
                'id': id_recruit
            })
            .update({
                'state': 3
            });
            await db('recruitment').where({
                'id': id_recruit
            });
            if (items.length==0)
                return null;
            return items[0];
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async rejectRecruitment(id_recruit){
        try {
            await db('recruitment').where({
                'id': id_recruit
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

    async delete_recruitment(id_recruit){
        try {
            await db('recruitment').where("id", id_recruit).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}