const db = require('../utils/connectDB');
const moment = require('moment');

module.exports = {
    async all(){
        let items = await db('admins');
        const n = items.length;
        let tempcount = 0;
        while(tempcount < n){
            items[tempcount].password = 'has-password';
            items[tempcount].create_time = moment(items[tempcount].create_time).format("DD/MM/YYYY HH:mm");
            tempcount = tempcount + 1;
        }
        return items
    },

    async getAdminsProfile(id){
        let items = await db('admins').where('id', id);
        if (items.length==0)
            return null;
        items[0].create_time = moment(items[0].create_time).format("DD/MM/YYYY HH:mm");
        items[0].password = 'has-password';
        return items[0];
    },
    async findAdminByID(id){
        let items = await db('admins').where('id', id);
        if (items.length==0)
            return null;
        return items[0];
    },
    async findAdminByEmail(email){
        let items = await db('admins').where('email', email);
        if (items.length==0)
            return null;
        return items[0];
    },
    async add(new_admin){
        try {
            await db('admins').insert(new_admin);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async updatePasswordByEmail(email, password){
        try {
            await db('admins').where('email', email).update({'password': password});
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    },
}