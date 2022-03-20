const db = require('../utils/connectDB')

module.exports = {
    allCategories(){
        return db('categories');
    },

    async findByID(idCate){
        const rows = await db('categories').where('id', idCate);
        if (rows.length === 0)
          return null;
        return rows[0];
    },

    async findByCateName(cateName){
        const rows = await db('categories').where('name', cateName);
        if (rows.length === 0)
          return null;
        return rows[0];
    },

    add(cateName){
        category = {name: cateName};
        return db('categories').insert(category);
    },

    del(cateid){
        return db('categories').where('id', cateid).del();
    }
}