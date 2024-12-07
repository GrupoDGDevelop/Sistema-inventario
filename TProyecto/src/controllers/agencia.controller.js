// Función para mostrar la lista de agencias
const verAgencia = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Agencia;`; // Consulta para obtener todas las agencias
        conn.query(read, (err, agencias) => {
            if (err) {
                res.json(err);  // En caso de error, responde con el error
            }
            res.render('agencia/agencia', { agencias });  // Renderiza la vista 'agencia' con los datos de las agencias
        });
    });
};

// Función para buscar agencias por nombre
const buscarAgencia = (req, res) => {
    const searchTerm = req.body.searchTerm; // Obtiene el término de búsqueda desde el cuerpo de la solicitud

    req.getConnection((err, conn) => {
        const query = `SELECT * FROM Agencia WHERE Nom_Agencia LIKE ?;`;  // Consulta para buscar agencias que coincidan con el término
        conn.query(query, [`%${searchTerm}%`], (err, agencias) => {
            if (err) {
                res.json(err);  // En caso de error, responde con el error
            }
            res.render('agencia/agencia', { agencias });  // Renderiza la vista 'agencia' con las agencias encontradas
        });
    });
};

// Función para mostrar el formulario de creación de agencia
const crearAgencia = (req, res) => {
    res.render('agencia/crear-agencia');  // Renderiza la vista para crear una nueva agencia
};

// Función para insertar una nueva agencia en la base de datos
const printAgencia = (req, res) => {
    const data = req.body;  // Obtiene los datos del cuerpo de la solicitud
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Agencia SET ?', [data], (err, rows) => {  // Inserta los datos en la tabla Agencia
            if (err) {
                console.error('Error al insertar en Agencia', err);  // Si ocurre un error, lo imprime en consola
                return res.status(500).send('Error al crear Agencia');  // Responde con un error 500
            } else {
                res.redirect('/verAgencia');  // Redirige a la vista que muestra todas las agencias
            }
        });
    });
};

// Función para mostrar el formulario de edición de una agencia
const editarAgencia = (req, res) => {
    const id_Area = req.params.id_Area;  // Obtiene el ID del área desde los parámetros de la URL
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Agencia WHERE Id_Area = ?;`;  // Consulta para obtener la agencia por ID
        conn.query(read, [id_Area], (err, agencias) => {
            if (err) {
                res.json(err);  // En caso de error, responde con el error
            }
            if (agencias.length > 0) {
                res.render('agencia/editar-agencia', { agencia: agencias[0] });  // Renderiza la vista de edición con los datos de la agencia
            } else {
                res.status(404).send("Agencia no encontrada");  // Si no se encuentra la agencia, responde con un error 404
            }
        });
    });
};

// Función para actualizar los datos de una agencia
function actualizarAgencia(req, res) {
    const id_Area = req.params.id_Area;  // Obtiene el ID del área desde los parámetros de la URL
    const data = req.body;  // Obtiene los datos del cuerpo de la solicitud

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);  // Si hay un error en la conexión, lo imprime en consola
            return res.json(err);  // Responde con el error
        }
        conn.query('UPDATE Agencia SET ? WHERE Id_Area = ?', [data, id_Area], (err, rows) => {  // Actualiza los datos de la agencia
            if (err) {
                console.error('Error al actualizar agencia', err);  // Si ocurre un error, lo imprime en consola
                return res.status(500).json({ message: 'Error al actualizar agencia', error: err.message });  // Responde con un error 500
            } else {
                res.redirect('/verAgencia');  // Redirige a la vista de agencias después de la actualización
            }
        });
    });
}

// Función para eliminar una agencia
const eliminarAgencia = (req, res) => {
    const id_Area = req.body.id_Area;  // Obtiene el ID del área desde el cuerpo de la solicitud
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Agencia WHERE Id_Area = ?', [id_Area], (err, rows) => {  // Elimina la agencia con el ID proporcionado
            res.redirect('/verAgencia');  // Redirige a la vista de agencias después de eliminar
        });
    });
};

// Exportación de las funciones para su uso en las rutas
module.exports = {
    verAgencia: verAgencia,
    buscarAgencia: buscarAgencia,
    crearAgencia: crearAgencia,
    printAgencia: printAgencia,
    actualizarAgencia: actualizarAgencia,
    editarAgencia: editarAgencia,
    eliminarAgencia: eliminarAgencia
};
