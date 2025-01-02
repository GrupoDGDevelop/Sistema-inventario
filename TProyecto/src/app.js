const express = require('express');
const morgan = require('morgan');
const config = require('./config'); // Importa la configuración de la app y MySQL
const myconnection = require('express-myconnection'); // Importa correctamente myconnection
const mysql = require('mysql'); // Importa el cliente de MySQL
const mongoose = require('mongoose'); // Para mongodb
const session = require('express-session');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
//const favicon = require('serve-favicon');
const path = require('path');

// Importar rutas y manejo de errores
const loginRutas = require('./rutas/login.rutas');
const usuarioRuta = require('./rutas/usuario.rutas');
const productoRutas = require('./rutas/producto.rutas');
const softwareRutas = require('./rutas/sofware.rutas');
const agenciaRutas = require('./rutas/agencia.rutas');
const marcaRutas = require('./rutas/marca.rutas');
const proovedorRutas = require('./rutas/proovedor.rutas');
const cartasRutas = require('./rutas/cartaR.rutas');

const app = express();

// Configuraciones
app.set('port', config.app.port); // Conexión con archivo Config
app.set('views', __dirname + '/views'); // Configuración de la carpeta de vistas

// Configura el motor de plantillas Handlebars
app.engine('.hbs', engine({
    layoutsDir: __dirname + '/views/layouts', // Directorio de layouts
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        ifCond: function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        eq: function (a, b) { // Define el helper `eq` para comparar valores
            return a === b;
        }
    }
}));

app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // Middleware para registro de peticiones HTTP
app.use(express.json()); // Middleware para parsear JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(session({ secret: 'mysecret', resave: true, saveUninitialized: true })); // Configuración de sesión
app.use(bodyParser.json());
//app.use(favicon(path.join(__dirname, 'public/imagenes', 'favicon-32x32.png'))); // Middleware para el favicon


// ** Nuevo: Configuración para servir archivos estáticos **
app.use(express.static(path.join(__dirname, 'public'))); // Exponer la carpeta public como estática

// Conexión a la base de datos MySQL usando los parámetros de configuración
app.use(myconnection(mysql, config.mysql, 'single')); // Asegúrate de que myconnection se use correctamente

// ** Conexión a MongoDB **
mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));


// ** Middleware para verificar autenticación **
function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        res.locals.isAuthenticated = true; // Define la variable global para las vistas
        res.locals.name = req.session.name; // Otras variables que necesitas para las vistas
        res.locals.role = req.session.role;
        return next(); // Si el usuario está autenticado, sigue a la siguiente función
    } else {
        res.locals.isAuthenticated = false;
        res.redirect('/login'); // Si no está autenticado, redirige al login
    }
}

// Rutas
app.use('/', loginRutas);
app.use('/', isAuthenticated, usuarioRuta);
app.use('/', isAuthenticated, cartasRutas);
app.use('/', isAuthenticated, productoRutas);
app.use('/', isAuthenticated, softwareRutas);
app.use('/', isAuthenticated, agenciaRutas);
app.use('/', isAuthenticated, marcaRutas);
app.use('/', isAuthenticated, proovedorRutas);

// Ruta para la página de inicio

app.get('/', isAuthenticated, async (req, res) => {
    try {
        // Conectar a la colección 'cartas_responsivas'
        const db = mongoose.connection;
        const collection = db.collection('cartas_responsivas');

        // Consulta para obtener las primeras 8 cartas, ordenadas por FechaU de forma descendente
        const cartas = await collection.find({})
            .sort({ FechaU: -1 }) // Ordenar por fecha descendente
            .limit(8) // Limitar a 8 resultados
            .toArray(); // Convertir los resultados a un array

        // Mapea los resultados para formatear la fecha
        const cartasFormateadas = cartas.map(carta => ({
            id_CartaR: carta.id_CartaR, // ID de la carta
            _id : carta._id, // ID  de la carta en la base de datos
            FechaU: new Date(carta.FechaU).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) // Formatear la fecha
        }));

        // Renderizar la vista 'home', pasando las cartas formateadas y el nombre del usuario
        res.render('home', {
            title: 'Inicio',
            name: req.session.name, // Nombre del usuario desde la sesión
            cartas: cartasFormateadas // Lista de cartas obtenida desde la base de datos
        });
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        res.status(500).send('Error interno del servidor');
    }
});


app.get('/servicios', isAuthenticated, (req, res) => {
    res.render('servicios');
});

// Exporta la aplicación para usarla en otros archivos
module.exports = app;
