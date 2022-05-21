const db = require('../utils/connectDB')
const moment = require('moment');
module.exports = {
    async createCardKols(id_kol) {
        try {
            await db('card_kols').insert({
                "email": '1',
                "address":'1',
                "phone": '1',
                "gender": '1',
                "image": '',
                "describe": '',
                "state": '0',
                "id_kol": id_kol,
            })
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async findCardKolsByIdKol(id_kol){
        let items = await db('card_kols').where('id_kol', id_kol);
        if (items.length==0)
            return null;
        return items[0];
    },
    async updateCardKolsByIdKol(id_kol, new_card){
        try {
            await db('card_kols').where('id_kol', id_kol).update(new_card);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async updateStateCard(id_kol, new_state){
        try {
            await db('card_kols').where('id_kol', id_kol).update({
                "state": new_state
            });
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}