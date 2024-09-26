const mysql = require('mysql');
const config = require('../config');

//archivo Configuracion
const dbconfig ={
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

//Conexion
let Conexion;
function conexionMysql(){
    Conexion = mysql.createConnection(dbconfig);

    Conexion.connect((err) => {
        if(err){
            console.log('[Problemas de  DB]', err);
            setTimeout(conexionMysql, 200);
        }else{
            console.log(['Conexion Exitosa!'])
        }
    })

    Conexion.on('error', err =>{
        console.log('[Problemas de Conexion a DB]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conexionMysql();
        }else{
            throw err;
        }

    })
}

conexionMysql();

function search(table){
    return new Promise( (resolve, reject) =>{
        Conexion.query(`SELECT * FROM usuarios`,(error, result) =>{
            return error ? reject(error) : resolve(result);
        })
    });
}

function id_search(table , id){
    return new Promise( (resolve, reject) =>{
        Conexion.query(`SELECT * FROM usuarios WHERE id_usuarios = ${id} `,(error, result) =>{
            return error ? reject(error) : resolve(result);
        })
    });
}

function insertar(table, data){
    return new Promise( (resolve, reject) =>{
        Conexion.query(`INSERT INTO usuarios SET ?`, data, (error, result) =>{
            return error ? reject(error) : resolve(result);
        })
    });
}

function actualizar(table, data){
    return new Promise( (resolve, reject) =>{
        Conexion.query(`UPDATE usuarios SET ? WHERE id_usuarios = ?`, [data, data.id], (error, result) =>{
            return error ? reject(error) : resolve(result);
        })
    });
}

function crear(tabla, data){
    if(data && data.id == 0){
        return insertar(tabla, data);
    }else{
        return actualizar(tabla, data);
    }
}


function eliminar(table, data){
    return new Promise( (resolve, reject) =>{
        Conexion.query(`DELETE FROM usuarios WHERE id_usuarios = ? `, data.id, (error, result) =>{
            return error ? reject(error) : resolve(result);
        })
    });
}

module.exports = {
    search,
    id_search,
    crear,
    eliminar,
}