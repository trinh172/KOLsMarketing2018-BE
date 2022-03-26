const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('posts');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
    },

    async allActivePosts(){
        let items = await db('posts').where({
            'state': 1
        });
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
        }
        return items
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
    /*
    Top 9 post most read in month --> Cơ hội hấp dẫn
    */
    async findTop9MostRead() {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('posts')
            .where({
                state: 1,
            })
            .andWhere('write_time', '>=', day_ago)
            .orderBy('views', 'desc')
            .limit(9)
        return rows;
    },
    //All post in month --> bài viết trên trang
    async findPostInMonth() {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('posts')
            .where({
                state: 1,
            })
            .andWhere('write_time', '>=', day_ago)
            .orderBy('write_time', 'desc')
            .limit(10);
        //console.log(rows);
        return rows;
    },

    async findPostInListCategories(list_categories){
        let post = await db.select('id_post').from('post_categories')
            .whereIn('id_cate', list_categories)
        if(post.length > 0){
            let result = Array.from(new Set(post));
            return result
        }
        return null;
    },
    async findListActivePostByID(list_id, list_address){
        if(list_id.length == 0){
            return null;
        }
        let list_post = []
        if(list_address.length > 0){
            for(i =0 ; i < list_id.length; i++){
                let post = await db('posts').where({
                    state: 1,
                    id: list_id[i]
                }).whereIn('address', list_address);
                if(post.length > 0)
                    list_post.push(post[0])
            }
        }
        if(list_address.length == 0){
            for(i =0 ; i < list_id.length; i++){
                let post = await db('posts').where({
                    state: 1,
                    id: list_id[i]
                });
                if(post.length > 0)
                    list_post.push(post[0])
            }
        }
        
        return list_post;
    },

    async findPostActiveInListAddress(list_address){
        let post = await db('posts')
            .whereIn('address', list_address);
        if(post.length == 0){
            return false
        }
        return post;
    },

    //Find new post (1 month) by Category --> từng chuyên mục
    async findNewPostByCategory(id_category) {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('post_categories')
            .where({
                id_cate: id_category,
            })
        let result = [];
        for(i = 0; i<rows.length; i++){
            const item = await db('posts')
                                .where({
                                    id: rows[i].id_post,
                                    state: 1,
                                })
            if(item!=null){
                if(item[0].write_time >= day_ago){
                    let brand = await db('brands')
                                .where({
                                    id: id_writer,
                                });
                    item.brand = brand;
                }
                result.push(item);
            }
        }
        return result;
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
    delete_post(id_post){
        return db('posts').where("id", id_post).del();
    },
}