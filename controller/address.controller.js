const address_db = require('../model/address.model');

exports.list_province_vn = async function(req, res) {
    let flag = await address_db.allProvince();
    if (flag){
        return res.json(flag);
    }
    return res.json([]);
}