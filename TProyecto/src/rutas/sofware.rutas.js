const express = require('express');
const SoftwareController = require('../controllers/software.controller');

const router = express.Router();

router.get('/verSoftware', SoftwareController.verSoftware);

router.post('/verSoftware/buscarS', SoftwareController.buscarS);

router.get('/crearSoftware', SoftwareController.crearS);
router.post('/crearSoftware', SoftwareController.printSoftware);

router.get('/software/editar/:id_S', SoftwareController.editarS);
router.post('/software/editar/:id_S', SoftwareController.actualizarSoftware);

router.post('/software/eliminar', SoftwareController.eliminarS);

module.exports = router;
