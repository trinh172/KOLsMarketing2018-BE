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

    async getBrandName(id_brand){
        const item = await db('brands').where({
            id: id_brand
        });
        if(item.length>0){
            return item[0].brand_name;
        }
        return '';
    },

    async getImageCover(id_post){
        let image_cover = await db('image_post')
                                .where({
                                    'id_post': id_post,
                                    'type': '2'
                                })
        if(image_cover.length > 0){
            return image_cover[0].url;
        }
        return '';
    },

    async getImagesOfJob(id_job){
        const items = await db('image_job').where({
            id_job: id_job
        });
        if(items.length>0){
            let result = [];
            for(index = 0; index < items.length; index++){
                result.push(items[index].url);
            }
            return result
        }
        else return [];
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
    
    async create_job_image(new_image) {
        try {
            await db('image_job').insert(new_image)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async findJobByBrandCreatetime(iduser, create_time){
        let items = await db('job_describe').where({
            'id_brand': iduser,
            'create_time': create_time
        });
        if (items.length==0)
            return null;
        return items[0];
    },

    async findCommentByUserCreatetime(iduser, role, create_time){
        let items = await db('job_comment').where({
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
        }).orderBy("create_time", "desc");
        if (items.length==0)
            return [];
        const brand_info = await this.getUserInfo(items[0].id_brand, 2);
        if(brand_info){
            
            let result = [];
            for (i = 0; i < items.length; i++){
                let image = await this.getImagesOfJob(items[i].id);
                let temp = {
                    content: items[i].content,
                    create_time: items[i].create_time,
                    id: items[i].id,
                    id_brand: items[i].id_brand,
                    id_post: items[i].id_post,
                    userInfo: brand_info,
                    image: image,
                };
                result.push(temp);
            }
            return result;
        }
        else{
            return [];
        }
        
    },

    async findCommentByJobID(id_job){
        let items = await db('job_comment').where({
            'id_job': id_job
        }).orderBy("create_time", "asc");
        if (items.length==0)
            return [];

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
            return [];
        for (i = 0; i < items.length; i++){
            items[i].userInfo = await this.getUserInfo(items[i].id_user, items[i].role);
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

    
      //Find all post that brand create count recruitment, and still work
      async findAllPostOfBrand(id_brand) {
        const rows = await db('posts')
            .where({
                "id_writer": id_brand,
            })
            .orderBy('write_time', 'desc');
        let tempcount = 0;
        while (tempcount < rows.length){
            let count = await db('job_member')
                            .where({
                                "id_post": rows[tempcount].id,
                                "role": 1
                            })
            rows[tempcount].count_member = count.length;
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': rows[tempcount].id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                rows[tempcount].image_cover = image_cover[0].url;
            }else{
                rows[tempcount].image_cover = null;
            }
            tempcount = tempcount + 1;
        }
        return rows;
    },

    //Find all job that kol is member
    async findAllJobOfKOL(id_kol) {
        const rows = await db('job_member')
            .where({
                "id_user": id_kol,
                "role": '1'
            })
            .orderBy('create_time', 'desc');
        let tempcount = 0;
        let result = [];
        while (tempcount < rows.length){
            let post_detail = await db('posts')
                            .where({
                                "id": rows[tempcount].id_post,
                            })
            if(post_detail.length > 0){
                let temp = {};
                temp.id = post_detail[0].id;
                temp.brand_name = await this.getBrandName(post_detail[0].id_writer);
                temp.image_cover = await this.getImageCover(post_detail[0].id);
                temp.title = post_detail[0].title;
                temp.content = post_detail[0].content;
                temp.requirement = post_detail[0].requirement;
                temp.write_time = moment(post_detail[0].write_time).format("DD/MM/YYYY HH:mm");
                temp.time_join_job = moment(rows[tempcount].create_time).format("DD/MM/YYYY HH:mm");
                result.push(temp);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },
}