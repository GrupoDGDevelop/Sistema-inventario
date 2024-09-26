const db = require('../../DB/mysql');

const TABLE = 'usuarios';

function search (){
    return db.search(TABLE);
}

function id_search (id){
    return db.id_search(TABLE, id);
}

function crear (body){
    return db.crear(TABLE, body);
}

function eliminar (body){
    return db.eliminar(TABLE, body);
}

module.exports = {
    search,
    id_search,
    crear,
    eliminar
}