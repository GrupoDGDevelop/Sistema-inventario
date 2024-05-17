const app = require('./app');

app.listen(app.get('port'), () => {
    console.log("Servicio disponible en el puerto :", app.get("port"));
});