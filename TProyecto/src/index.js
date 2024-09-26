const app = require('./app.js'); // Importa la aplicación

// Inicializa el servidor en el puerto definido en la configuración
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando en puerto:", app.get("port"));
});
