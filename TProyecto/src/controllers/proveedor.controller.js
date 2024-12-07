// Función para ver todos los proveedores
const verProveedores = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Proveedor;`; // Consulta SQL para obtener todos los proveedores
        conn.query(read, (err, proveedores) => {
            if (err) {
                return res.json(err); // Devuelve el error en formato JSON si ocurre uno
            }
            res.render('proveedor/proveedor', { proveedores }); // Renderiza la vista con la lista de proveedores
        });
    });
};

// Función para buscar proveedores por nombre
const buscarProveedor = (req, res) => {
    const searchTerm = req.body.searchTerm; // Término de búsqueda enviado desde el formulario

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Proveedor
            WHERE Nom_Proveedor LIKE ?
        `; // Consulta SQL para buscar proveedores cuyo nombre coincida parcialmente

        conn.query(query, [`%${searchTerm}%`], (err, proveedores) => {
            if (err) {
                return res.json(err); // Devuelve el error en formato JSON si ocurre uno
            }
            res.render('proveedor/proveedor', { proveedores }); // Renderiza la vista con los resultados de la búsqueda
        });
    });
};

// Función para renderizar el formulario de creación de un nuevo proveedor
const crearProveedor = (req, res) => {
    res.render('proveedor/crear-proveedor'); // Renderiza el formulario para crear un nuevo proveedor
};

// Función para insertar un nuevo proveedor en la base de datos
const printProveedor = (req, res) => {
    const data = req.body; // Datos enviados desde el formulario
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Proveedor SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Proveedor', err); // Muestra el error en la consola
                return res.status(500).send('Error al crear proveedor'); // Devuelve un error al cliente
            } else {
                res.redirect('/verProveedores'); // Redirige a la vista de proveedores tras la inserción exitosa
            }
        });
    });
};

// Función para renderizar la vista de edición de un proveedor
const editarProveedor = (req, res) => {
    const id_Proveedor = req.params.id_Proveedor; // ID del proveedor enviado en los parámetros de la URL
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Proveedor 
            WHERE Id_Proveedor = ?
        `; // Consulta SQL para obtener los datos del proveedor

        conn.query(read, [id_Proveedor], (err, proveedores) => {
            if (err) {
                return res.json(err); // Devuelve el error en formato JSON si ocurre uno
            }

            if (proveedores.length > 0) {
                res.render('proveedor/editar-proveedor', {
                    proveedor: proveedores[0] // Pasa los datos del proveedor a la vista de edición
                });
            } else {
                res.status(404).send("Proveedor no encontrado"); // Devuelve un error 404 si no se encuentra el proveedor
            }
        });
    });
};

// Función para actualizar un proveedor existente en la base de datos
const actualizarProveedor = (req, res) => {
    const id_Proveedor = req.params.id_Proveedor; // ID del proveedor enviado en los parámetros de la URL
    const data = req.body; // Datos enviados desde el formulario

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err); // Muestra el error en la consola
            return res.json(err); // Devuelve el error en formato JSON si ocurre uno
        }

        conn.query('UPDATE Proveedor SET ? WHERE Id_Proveedor = ?', [data, id_Proveedor], (err, rows) => {
            if (err) {
                console.error('Error al actualizar proveedor', err); // Muestra el error en la consola
                return res.status(500).json({ message: 'Error al actualizar proveedor', error: err.message }); // Devuelve un error al cliente
            } else {
                res.redirect('/verProveedores'); // Redirige a la vista de proveedores tras la actualización exitosa
            }
        });
    });
};

// Función para eliminar un proveedor de la base de datos
const eliminarProveedor = (req, res) => {
    const id_Proveedor = req.body.id_Proveedor; // ID del proveedor enviado en los datos del formulario
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Proveedor WHERE Id_Proveedor = ?', [id_Proveedor], (err, rows) => {
            res.redirect('/verProveedores'); // Redirige a la vista de proveedores tras la eliminación
        });
    });
};

// Exportación de las funciones para su uso en las rutas
module.exports = {
    verProveedores: verProveedores,
    buscarProveedor: buscarProveedor,
    crearProveedor: crearProveedor,
    printProveedor: printProveedor,
    actualizarProveedor: actualizarProveedor,
    editarProveedor: editarProveedor,
    eliminarProveedor: eliminarProveedor
};
