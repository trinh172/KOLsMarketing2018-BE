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

    async getAllCardKols(){
        try {
            let items = await db('card_kols').where("state", "1");
            for (i = 0; i < items.length; i++){
                let detail = await db("kols").where('id', items[i].id_kol);
                if(items[i].phone == '1')
                    items[i].phone = detail[0]?.phone;
                if(items[i].gender == '1')
                    items[i].gender = detail[0]?.gender;    
                if(items[i].address == '1')
                    items[i].address = detail[0]?.address;
                if(items[i].email == '1')
                    items[i].email = detail[0]?.email;
                items[i].likeKol = false;
            }
            return items;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async getAllCardKolsLikeInfo(id_brand){
        try {
            let items = await db('card_kols').where("state", "1");
            for (i = 0; i < items.length; i++){
                let detail = await db("kols").where('id', items[i].id_kol);
                if(items[i].phone == '1')
                    items[i].phone = detail[0]?.phone;
                if(items[i].gender == '1')
                    items[i].gender = detail[0]?.gender;    
                if(items[i].address == '1')
                    items[i].address = detail[0]?.address;
                if(items[i].email == '1')
                    items[i].email = detail[0]?.email;
                let like = await db("brands_like_kols").where({
                    id_brand: id_brand,
                    id_kol: items[i].id_kol
                })
                items[i].likeKol = false;
                if (like.length > 0){
                    items[i].likeKol = true;
                }
            }
            return items;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async findCardKolsByIdKol(id_kol){
       
        try {
            let items = await db('card_kols').where('id_kol', id_kol);
            if (items.length==0)
                return null;
            return items[0];
        } catch (e) {
            console.log(e);
            return false;
        }
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