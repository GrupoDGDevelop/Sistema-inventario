const express = require('express');
const router = express.Router();
const MarcaController = require('../controllers/marca.controller');

router.get('/verMarcas', MarcaController.verMarcas);
router.post('/verMarcas', MarcaController.buscarMarca);

router.get('/crearMarca', MarcaController.crearMarca);
router.post('/crearMarca', MarcaController.printMarca);

router.get('/editarMarca/:id_Marca', MarcaController.editarMarca);
router.post('/editarMarca/:id_Marca', MarcaController.actualizarMarca);

router.post('/eliminarMarca', MarcaController.eliminarMarca);

module.exports = router;
