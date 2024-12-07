// Función para obtener y mostrar todos los sistemas registrados en la base de datos
const verSoftware = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `
        SELECT * FROM Sistemas;
        `;
        conn.query(read, (err, sistemas) => {
            if (err) {
                res.json(err); // En caso de error, se envía el error como respuesta en formato JSON
            }
            res.render('software/software', { sistemas }); // Renderiza la vista y pasa los sistemas obtenidos
        });
    });
};

// Función para buscar un sistema por su nombre utilizando un término de búsqueda
const buscarS = (req, res) => {
    const searchTerm = req.body.searchTerm; // Toma el término de búsqueda enviado desde el formulario

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Sistemas
            WHERE Nom_Software LIKE ?
        `;

        conn.query(query, [`%${searchTerm}%`], (err, sistemas) => {
            if (err) {
                res.json(err); // Devuelve el error en formato JSON si ocurre uno
            }
            res.render('software/software', { sistemas }); // Renderiza la vista con los resultados de la búsqueda
        });
    });
};

// Función para renderizar la vista de creación de un nuevo sistema
const crearS = (req, res) => {
    res.render('software/crear-software'); // Renderiza el formulario para crear un sistema
};

// Función para insertar un nuevo sistema en la base de datos
const printSoftware = (req, res) => {
    const data = req.body; // Obtiene los datos enviados desde el formulario
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Sistemas SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Sistemas', err); // Muestra el error en la consola si ocurre
                return res.status(500).send('Error al Crear Sistema'); // Devuelve un error al cliente
            } else {
                res.redirect('/verSoftware'); // Redirige a la vista de sistemas tras la inserción exitosa
            }
        });
    });
};

// Función para renderizar la vista de edición de un sistema específico
const editarS = (req, res) => {
    const id_S = req.params.id_S; // Obtiene el ID del sistema desde los parámetros de la URL
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Sistemas 
            WHERE ID_Sistemas = ?
        `;

        conn.query(read, [id_S], (err, sistemas) => {
            if (err) {
                res.json(err); // Devuelve el error en formato JSON si ocurre
            }

            if (sistemas.length > 0) {
                res.render('software/editar-software', {
                    sistema: sistemas[0], // Envía el sistema encontrado para mostrarlo en el formulario
                });
            } else {
                res.status(404).send("Sistema no encontrado"); // Responde con un error 404 si no se encuentra el sistema
            }
        });
    });
};

// Función para actualizar la información de un sistema en la base de datos
function actualizarSoftware(req, res) {
    const id_S = req.params.id_S; // Obtiene el ID del sistema desde los parámetros de la URL
    const data = req.body; // Obtiene los datos enviados desde el formulario

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err); // Muestra el error en la consola
            return res.json(err); // Devuelve el error en formato JSON si ocurre
        }

        conn.query('UPDATE sistemas SET ? WHERE ID_Sistemas = ?', [data, id_S], (err, rows) => {
            if (err) {
                console.error('Error al actualizar sistema', err); // Muestra el error en la consola
                return res.status(500).json({ message: 'Error al actualizar sistema', error: err.message }); // Devuelve un error al cliente
            } else {
                res.redirect('/verSoftware'); // Redirige a la vista de sistemas tras la actualización exitosa
            }
        });
    });
}

// Función para eliminar un sistema de la base de datos
const eliminarS = (req, res) => {
    const id_S = req.body.id_S; // Obtiene el ID del sistema desde los datos enviados en el formulario
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Sistemas WHERE ID_Sistemas = ?', [id_S], (err, rows) => {
            res.redirect('/verSoftware'); // Redirige a la vista de sistemas tras la eliminación
        });
    });
};

// Exportación de todas las funciones para usarlas en otros archivos
module.exports = {
    verSoftware: verSoftware,
    buscarS: buscarS,
    crearS: crearS,
    printSoftware: printSoftware,
    actualizarSoftware: actualizarSoftware,
    editarS: editarS,
    eliminarS: eliminarS,
};
