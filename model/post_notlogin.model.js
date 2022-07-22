const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async all(){
        let items = await db('posts');
        for(let i = 0; i<items.length; i++){
            items[i].write_time = moment(items[i].write_time).format("DD/MM/YYYY HH:mm:ss");
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
            result.avatar = item[0].avatar;
            result.cover = item[0].cover;
            result.address = item[0].address;
            result.role = '2';
            return result
        }
    
        return null;
    },

    async getBrandName(iduser){
        const item = await db('brands').where({
            id: iduser
        });
        if(item.length>0){
            return item[0].brand_name;
        }
        else
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
        else
            return null;
    },

    async getAddressName(id){
        const item = await db('vn_tinhthanhpho').where({
            'id': id
        })
        if(item.length>0){
            return item[0].name;
        }
        else 
            return null;
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
            'state': 1,
            'status': 1
        });
        for(let i = 0; i<items.length; i++){
            items[i].write_time = moment(items[i].write_time).format("DD/MM/YYYY HH:mm:ss");
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

        if(items[0].address !== null){
            items[0].address = await this.getAddressName(items[0].address);
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
        items[0].write_time = moment(items[i].write_time).format("DD/MM/YYYY HH:mm");
        items[0].likePost = false;
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
        items[0].address = await this.getAddressName(items[0].address);
        items[0].write_time = moment(items[0].write_time).format("DD/MM/YYYY HH:mm");
        items[0].likePost = false;
        return items[0];
    },

    
    async findActivePostByIDPost(ID){
        let items = await db('posts').where({
                                        'id': ID,
                                        'state': 1,
                                        'status': 1
                                    });
        if (items.length == 0)
            return null;
        items[0].brand = await this.getBrandInfo(items[0].id_writer);
        items[0].image_cover = await this.getImageCover(ID);
        items[0].address = await this.getAddressName(items[0].address);
        items[0].write_time = moment(items[0].write_time).format("DD/MM/YYYY HH:mm");
        
        items[0].likePost = false;
        return items[0];
    },

    async findActivePostByIDPostInTime(ID, day_ago){
        let items = await db('posts').where({
                                        'id': ID,
                                        'state': 1,
                                        'status': 1
                                    })
                                    .andWhere('write_time', '>=', day_ago);
        if (items.length == 0)
            return null;
        items[0].brand = await this.getBrandInfo(items[0].id_writer);
        items[0].image_detail = await this.getImageDetail(ID);
        items[0].image_cover = await this.getImageCover(ID);
        items[0].list_categories = await this.getListCategoryOfPost(ID);
        items[0].address = await this.getAddressName(items[0].address);
        items[0].write_time = moment(items[0].write_time).format("DD/MM/YYYY HH:mm");
        items[0].likePost = false;
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
        items[0].address = await this.getAddressName(items[0].address);
        items[0].write_time = moment(items[0].write_time).format("DD/MM/YYYY HH:mm");
        items[0].likePost = false;
        return items[0];
    },

    async findAllPostOfBrands(brand_id){
        let items = await db('posts').where('id_writer', brand_id);
        if (items.length==0)
            return null;
        return items[0];
    },
    async findActivePostOfBrands(brand_id, id_current){
        let items = [];
        if(id_current){
            items = await db('posts').where({
                'id_writer': brand_id,
                'state': 1,
                'status': 1
            }).whereNot('id', id_current);
        }
        else{
            items = await db('posts').where({
                'id_writer': brand_id,
                'state': 1,
                'status': 1
            });
        }
        let result = [];
        for (i = 0; i< items.length; i++){
            let temp = {};
            temp.id = items[i]?.id;
            temp.id_writer = items[i]?.id_writer;
            temp.hot = items[i]?.hot;
            temp.max_cast = items[i]?.max_cast;
            temp.min_cast = items[i]?.min_cast;
            temp.title = items[i]?.title;
            let image_cover = await db('image_post')
                                    .where({
                                        'id_post': items[i]?.id,
                                        'type': '2'
                                    })
            if(image_cover.length > 0){
                temp.image_cover = image_cover[0].url;
            }else{
                temp.image_cover = null;
            }
            temp.likePost = false;
            temp.write_time = moment(items[i]?.write_time).format("DD/MM/YYYY HH:mm");
            temp.address = await this.getAddressName(items[i]?.address);
            result.push(temp);
        }
        return result;
    },

    //Lấy danh sách các bài đăng đề xuất, dựa theo top lượt xem
    async findSuggestPost( id_current){
        let items = [];
        if(id_current){
            items = await db('posts').where({
                'state': 1,
                'status': 1
            }).whereNot('id', id_current).orderBy('views', 'desc');
        }
        else{
            items = await db('posts').where({
                'state': 1,
                'status': 1
            }).orderBy('views', 'desc');
        }
        let result =[]
        for (i = 0; i< items.length; i++){
            let temp = {};
            temp.id = items[i]?.id;
            temp.id_writer = items[i]?.id_writer;
            temp.hot = items[i]?.hot;
            temp.max_cast = items[i]?.max_cast;
            temp.min_cast = items[i]?.min_cast;
            temp.title = items[i]?.title;
            temp.image_cover = await this.getImageCover(items[i]?.id);
            
            temp.likePost = false;
            temp.address = await this.getAddressName(items[i]?.address);
            temp.brand_name = await this.getBrandName(items[i]?.id_writer);
            result.push(temp)
        }
        return result;
    },

    async findUnactivePostOfBrands(brand_id){
        let items = await db('posts').where({
                                        'id_writer': brand_id,
                                        'state': 0,
                                        'status': 1
                                    });
        return items;
    },
    /*
    Top 9 post most read in month --> Cơ hội hấp dẫn
    */
    async findTop9MostRead() {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('posts')
            .where({
                state: 1,
                status: 1
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
            rows[i].likePost = false;
        }
        return rows;
    },
    //All post in month --> bài viết trên trang
    async findPostInMonth() {
        let day_ago = moment().subtract(30, "days");
        const rows = await db('posts')
            .where({
                state: 1,
                status: 1
            })
            .andWhere('write_time', '>=', day_ago)
            .orderBy('write_time', 'desc')
            .limit(10);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
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
        return [];
    },
    async findListActivePostByListIDAndAddress(list_id, list_address){
        if(list_id.length == 0){
            return [];
        }
        let rows = [];
        if(list_address.length > 0){
            rows = await db('posts').where('id', 'in', list_id).andWhere('address', 'in', list_address);
        }
        else {
            rows = await db('posts').where('id', 'in', list_id);
        }
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async findPostActiveInListAddress(list_address){
        let rows = await db('posts')
            .whereIn('address', list_address);
        if(rows.length == 0){
            return []
        }
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    //Find new post (1 month) by Category --> từng chuyên mục
    async findNewPostByCategory(id_category) {
        const rows = await db('post_categories')
            .where({
                id_cate: id_category,
            })
        let result = [];
        let tempcount = 0;
        while (tempcount < rows.length){
            let item = await this.findActivePostByIDPost(rows[tempcount].id_post);
            if(item != null){
                result.push(item);
            }
            tempcount = tempcount + 1;
        }
        return result;
    },

    async find60NewestPostModel() {
        const rows = await db('posts')
            .where({"status": '1', "state": '1'})
            .orderBy('write_time', 'desc')
            .limit(60);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async find120NewestPostModel() {
        const rows = await db('posts')
            .where({"status": '1', "state": '1'})
            .orderBy('write_time', 'desc')
            .limit(120);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async find6HighestCastPostModel() {
        const rows = await db('posts')
            .where({"status": '1', "state": '1'})
            .orderBy('min_cast', 'desc')
            .limit(6);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async find30HighestCastPostModel() {
        const rows = await db('posts')
            .where({'status': '1', "state":'1'})
            .orderBy('min_cast', 'desc')
            .limit(30);
        if(rows.length <= 0)
            return null;
        let tempcount = 0;
        while (tempcount < rows.length){
            rows[tempcount].image_cover = await this.getImageCover(rows[tempcount].id);
            rows[tempcount].brand_info = await this.getBrandInfo(rows[tempcount].id_writer);
            rows[tempcount].list_categories = await this.getListCategoryOfPost(rows[tempcount].id);
            rows[tempcount].address = await this.getAddressName(rows[tempcount].address);
            rows[tempcount].write_time = moment(rows[tempcount].write_time).format("DD/MM/YYYY HH:mm");
            rows[tempcount].likePost = false;
            tempcount = tempcount + 1;
        }
        return rows;
    },

    async updateView(newView, id_post){
        try {
            await db('posts').where({
                'id': id_post
            }).update({'views': newView});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
       
    }
}