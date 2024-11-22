const express = require('express');
const UsuarioController = require('../controllers/usuario.controller');

const router = express.Router();


router.get('/verUsuario', UsuarioController.verUsuario);


router.post('/verUsuario/buscarU', UsuarioController.buscarU);

router.get('/usuario/editar/:id_U', UsuarioController.editarU);
router.post('/usuario/editar/:id_U', UsuarioController.actualizarU);

router.post('/usuario/eliminar', UsuarioController.eliminarU);

module.exports = router;
