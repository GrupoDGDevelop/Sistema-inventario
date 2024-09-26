const express = require('express');
const morgan = require('morgan');
const config = require('./config'); // Importa la configuración de la app y MySQL
const myconnection = require('express-myconnection'); // Importa correctamente myconnection
const mysql = require('mysql'); // Importa el cliente de MySQL
const session = require('express-session');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');

const loginRutas = require('./rutas/login.rutas');

// Importar rutas y manejo de errores


const app = express();

// Configuraciones
app.set('port', config.app.port); // Configura el puerto desde la configuración
app.set('views', __dirname + '/views'); // Configuración de la carpeta de vistas
app.engine('.hbs', engine({
    extname: '.hbs',
})); // Configura el motor de plantillas Handlebars
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev')); // Middleware para registro de peticiones HTTP
app.use(express.json()); // Middleware para parsear JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(session({ secret: 'mysecret', resave: true, saveUninitialized: true })); // Configuración de sesión

// Conexión a la base de datos MySQL usando los parámetros de configuración
app.use(myconnection(mysql, config.mysql, 'single')); // Asegúrate de que myconnection se use correctamente


// Rutas
app.use('/',loginRutas);

app.get('/', (req, res) => {
    if(req.session.loggedin == true){

        res.render('home', {name: req.session.name});
      }else{
        res.redirect('/login');
      }
});

// Exporta la aplicación para usarla en otros archivos
module.exports = app;


