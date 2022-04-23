const db = require('../utils/connectDB')
const moment = require('moment');
const { post } = require('../routes/kols.routes');
module.exports = {
    async all(){
        let items = await db('posts');
        for(let i = 0; i<items.length; i++){
            items[i].create_time = moment(items[i].create_time).format("DD/MM/YYYY HH:mm:ss");
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
            result.introduce = item[0].introduce;
            result.phone = item[0].phone;
            result.name = item[0].brand_name;
            result.id = item[0].id;
            result.avatar = '';
            let url_avatar = await db("image_user").where({
                id_user: iduser,
                role: '2',
                type: 1
            });
            if(url_avatar.length > 0){
                result.avatar = url_avatar[0].url;
            }
            result.role = '2';
            return result
        }
    
        return null;
    },
    async getImageDetail(id_post){
        const item = await db('image_post').where({
            'id_post': id_post,
            'type': '1'
        })
        if(item.length>0){
            let result = [];
            for(i = 0; i < item.length; i++){
                result.push(item[i].url);
            }
            return result;
        }
        return [];
    },
    async getImageCover(id_post){
        const item = await db('image_post').where({
            'id_post': id_post,
            'type': '2'
        })
        if(item.length>0){
            return item[0].url;
        }
        return [];
    },

    async getListCategoryOfPost(id_post){
        let list_cate = [];
        let category = await db('post_categories').where({
            'id_post': id_post
        })
        if(category.length <= 0){
            return [];
        }
        for(i = 0; i < category.length; i++){
            let detailCate = await db('categories').where({
                'id': category[i].id_cate
            })
            list_cate.push(detailCate[0]);
        }
        return list_cate;
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
            items[0].image_cover = image_cover[0];
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
        items[0].brand = await this.getBrandInfo(items[0].id_writer);
        items[0].image_detail = await this.getImageDetail(ID);
        items[0].image_cover = await this.getImageCover(ID);
        items[0].list_categories = await this.getListCategoryOfPost(ID);
        console.log("Detail Post and brand in model: ", items[0]);
        return items[0];
    },

    async findActivePostByIDPostInTime(ID, day_ago){
        let items = await db('posts').where({
                                        'id': ID,
                                        'state': 1
                                    })
                                    .andWhere('write_time', '>=', day_ago);
        if (items.length == 0)
            return null;
        items[0].brand = await this.getBrandInfo(items[0].id_writer);
        items[0].image_detail = await this.getImageDetail(ID);
        items[0].image_cover = await this.getImageCover(ID);
        items[0].list_categories = await this.getListCategoryOfPost(ID);
        console.log("Detail Post and brand in model: ", items[0]);
        return items[0];
    },

    async findAllPostByIDPostInTime(ID, day_ago){
        let items = await db('posts').where({
                                        'id': ID
                                    })
                                    .andWhere('write_time', '>=', day_ago);
        if (items.length == 0)
            return null;
        items[0].brand = await this.getBrandInfo(items[0].id_writer);
        items[0].image_detail = await this.getImageDetail(ID);
        items[0].image_cover = await this.getImageCover(ID);
        items[0].list_categories = await this.getListCategoryOfPost(ID);
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
            while (tempcount < rows.length){
                rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
                rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
                rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
                tempcount = tempcount + 1;
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
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.findActivePostByIDPostInTime(rows[tempcount].id_post, day_ago);
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    //Find all post that user like, sap xep theo thu tu ma user like
    async findAllPostsKolsLike(idkol) {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('kols_like_post')
            .where({
                id_kol: idkol,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.findAllPostByIDPostInTime(rows[tempcount].id_post, day_ago);
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

      //Find all post that user recruitment, sap xep theo thu tu ma user ung tuyen
    async findAllPostsKolsRecruitment(idkol) {
        const rows = await db('recruitment')
            .where({
                id_kols: idkol,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.findPostAndBrandByIDPost(rows[tempcount].id_post)
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    async find60NewestPostModel() {
        const rows = await db('posts')
            .where("state", '1')
            .orderBy('write_time', 'desc')
            .limit(60);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            tempcount = tempcount + 1;
        }
        console.log("60 bai post nè: ", rows);
        return rows;
    },

    async find120NewestPostModel() {
        const rows = await db('posts')
            .where("state", '1')
            .orderBy('write_time', 'desc')
            .limit(120);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async find6HighestCastPostModel() {
        const rows = await db('posts')
            .where("state", '1')
            .orderBy('min_cast', 'desc')
            .limit(6);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async find30HighestCastPostModel() {
        const rows = await db('posts')
            .where("state", '1')
            .orderBy('min_cast', 'desc')
            .limit(30);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            tempcount = tempcount + 1;
        }
        return rows;
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
    async kolsLikePost(id_kol, id_post) {
        try {
            await db('kols_like_post').insert({
                'id_post': id_post,
                'id_kol': id_kol
            })
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async kolsUnlikePost(id_kol, id_post) {
        try {
            await db('kols_like_post').where({
                'id_post': id_post,
                'id_kol': id_kol
            }).del();
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}