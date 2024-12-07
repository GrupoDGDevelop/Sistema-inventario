// Función para ver todas las marcas
const verMarcas = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Marca;`; // Consulta para obtener todas las marcas de la base de datos
        conn.query(read, (err, marcas) => { // Ejecuta la consulta
            if (err) {
                return res.json(err); // Si hay error, lo devuelve como respuesta
            }
            res.render('marca/marca', { marcas }); // Renderiza la vista 'marca' y pasa las marcas obtenidas
        });
    });
};

// Función para buscar marcas por nombre
const buscarMarca = (req, res) => {
    const searchTerm = req.body.searchTerm; // Obtiene el término de búsqueda desde el cuerpo de la solicitud

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Marca
            WHERE Nom_Marca LIKE ?`; // Consulta para buscar marcas cuyo nombre coincida parcialmente con el término de búsqueda

        conn.query(query, [`%${searchTerm}%`], (err, marcas) => { // Ejecuta la consulta con el término de búsqueda
            if (err) {
                return res.json(err); // Si hay error, lo devuelve como respuesta
            }
            res.render('marca/marca', { marcas }); // Renderiza la vista 'marca' y pasa las marcas encontradas
        });
    });
};

// Función para renderizar el formulario de creación de una nueva marca
const crearMarca = (req, res) => {
    res.render('marca/crear-marca'); // Renderiza la vista del formulario para crear una nueva marca
};

// Función para insertar una nueva marca en la base de datos
const printMarca = (req, res) => {
    const data = req.body; // Obtiene los datos del cuerpo de la solicitud
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Marca SET ?', [data], (err, rows) => { // Inserta los datos en la tabla Marca
            if (err) {
                console.error('Error al insertar en Marca', err); // Si hay un error, lo muestra en la consola
                return res.status(500).send('Error al Crear Marca'); // Responde con un error 500 si ocurre un problema
            } else {
                res.redirect('/verMarcas'); // Si la inserción fue exitosa, redirige a la vista de marcas
            }
        });
    });
};

// Función para renderizar la vista de edición de una marca
const editarMarca = (req, res) => {
    const id_Marca = req.params.id_Marca; // Obtiene el ID de la marca desde los parámetros de la solicitud
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Marca 
            WHERE Id_Marca = ?`; // Consulta para obtener la marca con el ID proporcionado

        conn.query(read, [id_Marca], (err, marcas) => { // Ejecuta la consulta
            if (err) {
                return res.json(err); // Si hay un error, lo devuelve como respuesta
            }

            if (marcas.length > 0) { // Si la marca existe
                res.render('marca/editar-marca', {
                    marca: marcas[0] // Renderiza la vista de edición con la marca encontrada
                });
            } else {
                res.status(404).send("Marca no encontrada"); // Si no se encuentra la marca, devuelve un error 404
            }
        });
    });
};

// Función para actualizar una marca existente en la base de datos
const actualizarMarca = (req, res) => {
    const id_Marca = req.params.id_Marca; // Obtiene el ID de la marca desde los parámetros de la solicitud
    const data = req.body; // Obtiene los nuevos datos del cuerpo de la solicitud

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err); // Si hay un error en la conexión, lo muestra en la consola
            return res.json(err); // Devuelve el error como respuesta
        }

        conn.query('UPDATE Marca SET ? WHERE Id_Marca = ?', [data, id_Marca], (err, rows) => { // Actualiza la marca en la base de datos
            if (err) {
                console.error('Error al actualizar marca', err); // Si hay un error, lo muestra en la consola
                return res.status(500).json({ message: 'Error al actualizar marca', error: err.message }); // Responde con un error 500
            } else {
                res.redirect('/verMarcas'); // Si la actualización fue exitosa, redirige a la vista de marcas
            }
        });
    });
};

// Función para eliminar una marca de la base de datos
const eliminarMarca = (req, res) => {
    const id_Marca = req.body.id_Marca; // Obtiene el ID de la marca desde el cuerpo de la solicitud
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Marca WHERE Id_Marca = ?', [id_Marca], (err, rows) => { // Elimina la marca con el ID proporcionado
            res.redirect('/verMarcas'); // Después de eliminarla, redirige a la vista de marcas
        });
    });
};

// Exportación de las funciones para su uso en las rutas
module.exports = {
    verMarcas: verMarcas,
    buscarMarca: buscarMarca,
    crearMarca: crearMarca,
    printMarca: printMarca,
    actualizarMarca: actualizarMarca,
    editarMarca: editarMarca,
    eliminarMarca: eliminarMarca
};
