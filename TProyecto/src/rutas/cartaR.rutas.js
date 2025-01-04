const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Usar memoria en lugar de archivo físico
const upload = multer({ storage: storage });


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
// Ruta de actualización de carta con el middleware de multer
router.post('/editarCarta/:id_Carta', upload.single('PDF'), CartaController.actualizarCarta);

router.post('/eliminarCarta', CartaController.eliminarCarta);
router.post('/eliminarCartaPDF/:id', CartaController.eliminarCartaPDF);


module.exports = router;