const express = require('express');
const ProductoController = require('../controllers/producto.controller');

const router = express.Router();

router.get('/verProducto', ProductoController.verProducto);

router.post('/verProducto/buscarP', ProductoController.buscarP);

//router.get('/crearProducto', ProductoController.crearP);
router.get('/caracteristicas/:tipoProducto', ProductoController.obtenerCaracteristicas);
router.get('/caracteristicas/', ProductoController.unicas);
router.post('/nuevoTipoProducto', ProductoController.agregarTipoProducto);
router.post('/nuevaCaracteristica', ProductoController.agregarCaracteristica);
router.post('/nuevoProducto', ProductoController.agregarProducto)
router.post('/crearProducto', ProductoController.print);

router.get('/producto/editar/:id_P', ProductoController.editarP);
router.post('/producto/editar/:id_P', ProductoController.actualizar);

router.post('/producto/eliminar', ProductoController.eliminarP);

module.exports = router;