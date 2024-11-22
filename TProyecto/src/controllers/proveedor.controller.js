// Función para ver todos los proveedores
const verProveedores = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Proveedor;`;
        conn.query(read, (err, proveedores) => {
            if (err) {
                return res.json(err);
            }
            res.render('proveedor/proveedor', { proveedores });
        });
    });
};

// Función para buscar proveedores por nombre
const buscarProveedor = (req, res) => {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Proveedor
            WHERE Nom_Proveedor LIKE ?
        `;

        conn.query(query, [`%${searchTerm}%`], (err, proveedores) => {
            if (err) {
                return res.json(err);
            }
            res.render('proveedor/proveedor', { proveedores });
        });
    });
};

// Función para renderizar el formulario de creación de un nuevo proveedor
const crearProveedor = (req, res) => {
    res.render('proveedor/crear-proveedor');
};

// Función para insertar un nuevo proveedor en la base de datos
const printProveedor = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Proveedor SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Proveedor', err);
                return res.status(500).send('Error al crear proveedor');
            } else {
                res.redirect('/verProveedores');
            }
        });
    });
};

// Función para renderizar la vista de edición de un proveedor
const editarProveedor = (req, res) => {
    const id_Proveedor = req.params.id_Proveedor;
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Proveedor 
            WHERE Id_Proveedor = ?
        `;

        conn.query(read, [id_Proveedor], (err, proveedores) => {
            if (err) {
                return res.json(err);
            }

            if (proveedores.length > 0) {
                res.render('proveedor/editar-proveedor', {
                    proveedor: proveedores[0]
                });
            } else {
                res.status(404).send("Proveedor no encontrado");
            }
        });
    });
};

// Función para actualizar un proveedor existente en la base de datos
const actualizarProveedor = (req, res) => {
    const id_Proveedor = req.params.id_Proveedor;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.json(err);
        }

        conn.query('UPDATE Proveedor SET ? WHERE Id_Proveedor = ?', [data, id_Proveedor], (err, rows) => {
            if (err) {
                console.error('Error al actualizar proveedor', err);
                return res.status(500).json({ message: 'Error al actualizar proveedor', error: err.message });
            } else {
                res.redirect('/verProveedores');
            }
        });
    });
};

// Función para eliminar un proveedor de la base de datos
const eliminarProveedor = (req, res) => {
    const id_Proveedor = req.body.id_Proveedor;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Proveedor WHERE Id_Proveedor = ?', [id_Proveedor], (err, rows) => {
            res.redirect('/verProveedores');
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
