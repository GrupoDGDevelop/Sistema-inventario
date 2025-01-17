require('dotenv').config();
const myconection = require('express-myconnection');
const mongoose = require('mongoose');


module.exports = {
    app: {
        port: process.env.PORT || 4000, 
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost', 
        user: process.env.MYSQL_USER || 'root', 
        password: process.env.MYSQL_PASSWORD || '', 
        database: process.env.MYSQL_DATABASE || 'sistema_inventario', 
    },
    mongo: {
        uri: 'mongodb://localhost:27017/inventario_productos'
    }
};
