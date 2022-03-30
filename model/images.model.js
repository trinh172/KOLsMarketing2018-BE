const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('brands');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },
    async addImagePosts(image){
        try {
            await db('image_post').insert(image)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async findPostsByID(ID){
        let items = await db('posts').where('id', ID);
        if (items.length==0)
            return null;
        return items[0];
    },

    async findAllPostOfBrands(brand_id){
        let items = await db('posts').where('id_writer', brand_id);
        if (items.length==0)
            return null;
        return items[0];
    },
    async findActivePostOfBrands(brand_id){
        let items = await db('posts').where({
                                        'id_writer': brand_id,
                                        'state': 1
                                    });
        if (items.length==0)
            return null;
        return items[0];
    },
    async findUnactivePostOfBrands(brand_id){
        let items = await db('posts').where({
                                        'id_writer': brand_id,
                                        'state': 0
                                    });
        if (items.length==0)
            return null;
        return items[0];
    },
    async createPosts(post) {
        try {
            await db('brands').insert(user)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    
}