const db = require('../utils/connectDB');
const moment = require('moment');

module.exports = {
    async all(){
        let items = await db('admins');
        const n = items.length;
        let tempcount = 0;
        while(tempcount < n){
            items[tempcount].password = 'has-password';
            items[tempcount].create_time = moment(items[tempcount].create_time).format("DD/MM/YYYY HH:mm");
            tempcount = tempcount + 1;
        }
        return items
    },

    async getBrandInfo(iduser){
        const item = await db('brands').where({
            id: iduser
        });
        if(item.length>0){
            let result = {};
            result.email = item[0].email;
            result.name = item[0].brand_name;
            result.id = item[0].id;
            result.avatar = item[0].avatar;
            result.role = '2';
            return result
        }
    
        return null;
    },

    async getAdminsProfile(id){
        let items = await db('admins').where('id', id);
        if (items.length==0)
            return null;
        items[0].create_time = moment(items[0].create_time).format("DD/MM/YYYY HH:mm");
        items[0].password = 'has-password';
        return items[0];
    },
    async findAdminByID(id){
        let items = await db('admins').where('id', id);
        if (items.length==0)
            return null;
        return items[0];
    },
    async findAdminByEmail(email){
        let items = await db('admins').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },
    async add(new_admin){
        try {
            await db('admins').insert(new_admin);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

     //Find all post by Category --> từng chuyên mục
     async getListPostByCategory(id_category) {
        const rows = await db('post_categories')
            .where({
                id_cate: id_category,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await db('posts').where({
                                            id: rows[tempcount].id_post,
                                        });
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    //Find all post by Category --> từng chuyên mục
    async getAllPost() {
        const rows = await db('posts');
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async updatePasswordByEmail(email, password){
        try {
            await db('admins').where('email', email).update({'password': password});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateStatusOfPost(id_post, new_status) {
        try {
            await db('posts').where({
                'id': id_post,
            }).update("status", new_status);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async updateCategoryName(id_cate, new_name) {
        try {
            await db('categories').where({
                'id': id_cate,
            }).update("name", new_name);
            let list_cate = await db('categories');
            return list_cate;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}