const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async getKolsInfo(iduser){
        const item = await db('kols').where({
            id: iduser
        });
        if(item.length>0){
            let result = {};
            result.name = item[0].full_name;
            result.id = item[0].id;
            result.avatar = item[0].avatar;
            result.role = '2';
            return result
        }
    
        return null;
    },
    
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

    async findRecruitmentByKolsPost(iduser, id_post){
        let items = await db('recruitment').where({
            'id_kols': iduser,
            'id_post': id_post
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
            return [];
        for (i = 0; i < items.length; i++){
            items[i].kols_info = await this.getKolsInfo(items[i].id_kols);
        }
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
            return true
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