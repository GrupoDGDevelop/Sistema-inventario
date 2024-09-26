const app = require('./app.js');

app.listen(app.get('port'),() => {
    console.log("servidor funcionando en puerto: ", app.get("port"))
})