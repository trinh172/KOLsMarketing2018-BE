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
                else items[i].phone = null;

                if(items[i].gender == '1')
                    items[i].gender = detail[0]?.gender;
                else items[i].gender = null;

                if(items[i].address == '1')
                {
                    if(detail[0]?.address){
                        let addressname = await db("vn_tinhthanhpho").where({
                            id: detail[0]?.address
                        });
                        if(addressname.length > 0){
                            items[i].address = addressname[0].name;
                        }
                        else items[i].address = null;
                    }
                    else items[i].address = null;
                }
                else items[i].address = null;

                if(items[i].email == '1')
                    items[i].email = detail[0]?.email;
                else items[i].email = null;
                let count_followers = await db("brands_like_kols").where({
                    id_kol: items[i].id_kol
                })
                items[i].count_followers = count_followers.length;
                items[i].likeKol = false;
                items[i].full_name = detail[0].full_name;
                items[i].avatar = detail[0].avatar;
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
            let i = 0;
            while (i < items.length){
                let detail = await db("kols").where('id', items[i].id_kol);

                if(items[i].phone == '1')
                    items[i].phone = detail[0]?.phone;
                else items[i].phone = null;

                if(items[i].gender == '1')
                    items[i].gender = detail[0]?.gender;
                else items[i].gender = null;

                if(items[i].address == '1')
                {
                    if(detail[0]?.address){
                        let addressname = await db("vn_tinhthanhpho").where({
                            id: detail[0]?.address
                        });
                        if(addressname.length > 0){
                            items[i].address = addressname[0].name;
                        }
                        else items[i].address = null;
                    }
                    else items[i].address = null;
                }
                else items[i].address = null;

                if(items[i].email == '1')
                    items[i].email = detail[0]?.email;
                else items[i].email = null;

                let like = await db("brands_like_kols").where({
                    id_brand: id_brand,
                    id_kol: items[i].id_kol
                })
                items[i].likeKol = false;
                if (like.length > 0){
                    items[i].likeKol = true;
                }
                let count_followers = await db("brands_like_kols").where({
                    id_kol: items[i].id_kol
                })
                items[i].count_followers = count_followers.length;
                items[i].full_name = detail[0].full_name;
                items[i].avatar = detail[0].avatar;
                i = i + 1;
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