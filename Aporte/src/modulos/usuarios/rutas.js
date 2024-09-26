const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

router.get('/', search);
router.get('/:id', id_search);
router.post('/', crear);

router.put('/', eliminar);

async function search(req, res, next) {
    try {
        const items = await controlador.search()
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

async function id_search(req, res, next) {
    try {
        const items = await controlador.id_search(req.body);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

async function crear(req, res, next) {
    try {
        const items = await controlador.crear(req.body);
        if(req.body.id == 0)
        {
            mensaje = 'Item guardado correctamente';
        }else{
            mensaje = 'Item actualizado correctamente';
        }
        respuesta.success(req, res, mensaje, 201);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Eliminado correctamente', 200);
    } catch (err) {
        next(err);
    }
}


module.exports = router;
