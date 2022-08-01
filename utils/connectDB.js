const knex_local= require('knex')({
    client: 'pg',
    connection: {
        host : 'localhost',
        port : 5432,
        user : 'postgres',
        password : 'root',
        database : 'kolsmarketing'
    }
});
const connectionString = 'postgres://jkwsxvqimuejkd:9b5ad04cf41964ef8fb6e1f8e52bb9dac99e6b8efc612a59fdfa9129d122dadf@ec2-23-23-182-238.compute-1.amazonaws.com:5432/ddtlqo7msvvvp7';


const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString,
        ssl: {
            rejectUnauthorized: false 
        },
    },
    searchPath: ['knex', 'public'],
  });

//module.exports = knex_local;
module.exports = knex;
