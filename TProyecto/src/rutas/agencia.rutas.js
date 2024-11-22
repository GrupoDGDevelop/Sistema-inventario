const express = require('express');
const AgenciaController = require('../controllers/agencia.controller');

const router = express.Router();

router.get('/verAgencia', AgenciaController.verAgencia);
router.post('/verAgencia', AgenciaController.buscarAgencia);

router.get('/crearAgencia', AgenciaController.crearAgencia);
router.post('/crearAgencia', AgenciaController.printAgencia);

router.get('/editarAgencia/:id_Area', AgenciaController.editarAgencia);
router.post('/editarAgencia/:id_Area', AgenciaController.actualizarAgencia);

router.post('/eliminarAgencia', AgenciaController.eliminarAgencia);

module.exports = router;
