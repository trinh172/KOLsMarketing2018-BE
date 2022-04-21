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
        if (items.length == 0)
            return null;
        
        let brand = await db('brands').where('id', items[0].id_writer);
        if(brand.length > 0){
            items[0].brand_name = brand[0].brand_name;
            items[0].brand_introduce = brand[0].introduce;
        }
        else{
            items[0].brand_name = '';
            items[0].brand_introduce = '';
        }

        let image_detail = await db('image_post').where({
            'id_post': ID,
            'type': '1'
        })
        let image_cover = await db('image_post').where({
            'id_post': ID,
            'type': '2'
        })
        if(image_cover.length > 0){
            items[0].image_cover = image_cover[0].url;
        }
        if(image_detail.length > 0){
            items[0].image_detail = image_detail
        }
        let list_cate = [];
        let category = await db('post_categories').where({
            'id_post': ID
        })
        for(i = 0; i < category.length; i++){
            let detailCate = await db('categories').where({
                'id': category[i].id_cate
            })
            list_cate.push(detailCate[0]);
        }
        items[0].list_categories = list_cate;
        console.log("Detail Post model: ", items[0]);
        return items[0];
    },

    async findPostAndBrandByIDPost(ID){
        let items = await db('posts').where('id', ID);
        if (items.length == 0)
            return null;
        
        let brand = await db('brands').where('id', items[0].id_writer);
        if(brand.length > 0){
            items[0].brand = brand[0];
        }
        else{
            items[0].brand = null;
        }

        let image_detail = await db('image_post').where({
            'id_post': ID,
            'type': '1'
        })
        let image_cover = await db('image_post').where({
            'id_post': ID,
            'type': '2'
        })
        if(image_cover.length > 0){
            items[0].image_cover = image_cover[0].url;
        }
        if(image_detail.length > 0){
            items[0].image_detail = image_detail
        }
        let list_cate = [];
        let category = await db('post_categories').where({
            'id_post': ID
        })
        for(i = 0; i < category.length; i++){
            let detailCate = await db('categories').where({
                'id': category[i].id_cate
            })
            list_cate.push(detailCate[0]);
        }
        items[0].list_categories = list_cate;
        console.log("Detail Post and brand in model: ", items[0]);
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
        if(rows.length <= 0)
            return null;
        for (i = 0; i< rows.length; i++){
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': rows[i].id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                rows[i].image_cover = image_cover[0].url;
            }
            let brand = await db('brands')
                                .where({
                                    id: rows[i].id_writer,
                                });
            rows[i].brand = brand[0];
        }
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
        if(rows.length <= 0)
            return null;
        for (i = 0; i< rows.length; i++){
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': rows[i].id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                rows[i].image_cover = image_cover[0].url;
            }
            let brand = await db('brands')
                                .where({
                                    id: rows[i].id_writer,
                                });
            rows[i].brand = brand[0];
        }
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
        if(list_post.length <= 0)
            return null;
        for (i = 0; i< list_post.length; i++){
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': list_post[i].id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                list_post[i].image_cover = image_cover[0].url;
            }
            let brand = await db('brands')
                                .where({
                                    id: list_post[i].id_writer,
                                });
            list_post[i].brand = brand[0];
        }
        return list_post;
    },

    async findPostActiveInListAddress(list_address){
        let post = await db('posts')
            .whereIn('address', list_address);
        if(post.length == 0){
            return false
        }
        for (i = 0; i< post.length; i++){
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': post[i].id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                post[i].image_cover = image_cover[0].url;
            }
            let brand = await db('brands')
                                .where({
                                    id: post[i].id_writer,
                                });
            post[i].brand = brand[0];
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
                                    id: item[0].id_writer,
                                });
                    item[0].brand = brand;
                    let image_cover = await db('image_post')
                                    .where({
                                        'id_post': item[0].id,
                                        'type': '2'
                                    })
                    if(image_cover.length > 0){
                        item[0].image_cover = image_cover[0].url;
                    }
                }
                result.push(item[0]);
            }
        }
        return result;
    },

    async createPosts(post) {
        try {
            await db('posts').insert(post)
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    delete_post(id_post){
        return db('posts').where("id", id_post).del();
    },
    async findPostByBrandTitle(iduser, title){
        let items = await db('posts').where({
            'id_writer': iduser,
            'title': title
        });
        if (items.length==0)
            return null;
        return items[0];
    },
}