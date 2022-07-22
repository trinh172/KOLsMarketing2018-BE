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
//const connectionString = 'postgres://qaikjuzosgngng:b6f082bf72bd9b027e804a583ad5700fe6bed5d055b120410eba16298e040b52@ec2-3-232-22-121.compute-1.amazonaws.com:5432/dcr2rbcrk9vd8l';
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

module.exports = knex_local;
//module.exports = knex;
