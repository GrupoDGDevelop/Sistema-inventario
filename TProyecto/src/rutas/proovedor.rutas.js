const express = require('express');
const router = express.Router();
const ProveedorController = require('../controllers/proveedor.controller');

router.get('/verProveedores', ProveedorController.verProveedores);
router.post('/verProveedores', ProveedorController.buscarProveedor);

router.get('/crearProveedor', ProveedorController.crearProveedor);
router.post('/crearProveedor', ProveedorController.printProveedor);

router.get('/editarProveedor/:id_Proveedor', ProveedorController.editarProveedor);
router.post('/editarProveedor/:id_Proveedor', ProveedorController.actualizarProveedor);

router.post('/eliminarProveedor', ProveedorController.eliminarProveedor);

module.exports = router;
