const db = require('../utils/connectDB')

module.exports = {
    async findPostByCategory(id_cate){
        const rows = await db('post_categories').where('id_cate', id_cate);
        if (rows.length === 0)
          return null;
        return rows;
    },

    async findCategoriesByPost(id_post){
        const rows = await db('post_categories').where('id_post', id_post);
        if (rows.length === 0)
          return null;
        return rows;
    },

    add(catepost){
        return db('post_categories').insert(catepost);
    }
}