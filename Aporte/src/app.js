const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const usuarios = require('./modulos/usuarios/rutas'); 
const error = require('./red/errors');

const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuraciones
app.set('port', config.app.port)

//rutas
app.use ('/api/usuarios', usuarios)
app.use(error);

module.exports = app;