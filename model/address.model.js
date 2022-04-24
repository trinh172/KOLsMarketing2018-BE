const db = require('../utils/connectDB')

module.exports = {
    async allProvince(){
        const rows = await db('vn_tinhthanhpho');
        if (rows.length === 0)
          return null;
        return rows;
    },
}