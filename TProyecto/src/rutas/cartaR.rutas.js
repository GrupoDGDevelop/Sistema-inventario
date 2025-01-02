const express = require('express');
const CartaController = require('../controllers/CartaR/cartaR.controller');
const ReporteController = require('../controllers/CartaR/reporteCR.controller');

const router = express.Router();

router.get('/verCartaR', ReporteController.verCarta);
router.post('/verCartaR', ReporteController.buscarCarta);

router.get('/imprimirCartaPDF/:id_Carta', ReporteController.vistaImprimir);
//router.get('/descargarCartaPDF/:id_Carta', ReporteController.imprimirCarta);

router.get('/crearCartaR', CartaController.crearCarta);
router.post('/crearCartaR', CartaController.guardarCarta);

router.get('/crearCartaR/:tipo/:id', CartaController.obtenerDatos);
router.get('/editarCarta/:tipo/:id', CartaController.obtenerDatos);

router.get('/editarCarta/:id_Carta', CartaController.editarCarta);
router.post('/editarCarta/:id_Carta', CartaController.actualizarCarta);

router.post('/eliminarCarta', CartaController.eliminarCarta);


module.exports = router;