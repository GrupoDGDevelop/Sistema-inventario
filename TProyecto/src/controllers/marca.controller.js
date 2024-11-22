// Función para ver todas las marcas
const verMarcas = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Marca;`;
        conn.query(read, (err, marcas) => {
            if (err) {
                return res.json(err);
            }
            res.render('marca/marca', { marcas });
        });
    });
};

// Función para buscar marcas por nombre
const buscarMarca = (req, res) => {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Marca
            WHERE Nom_Marca LIKE ?
        `;

        conn.query(query, [`%${searchTerm}%`], (err, marcas) => {
            if (err) {
                return res.json(err);
            }
            res.render('marca/marca', { marcas });
        });
    });
};

// Función para renderizar el formulario de creación de una nueva marca
const crearMarca = (req, res) => {
    res.render('marca/crear-marca');
};

// Función para insertar una nueva marca en la base de datos
const printMarca = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Marca SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Marca', err);
                return res.status(500).send('Error al Crear Marca');
            } else {
                res.redirect('/verMarcas');
            }
        });
    });
};

// Función para renderizar la vista de edición de una marca
const editarMarca = (req, res) => {
    const id_Marca = req.params.id_Marca;
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Marca 
            WHERE Id_Marca = ?
        `;

        conn.query(read, [id_Marca], (err, marcas) => {
            if (err) {
                return res.json(err);
            }

            if (marcas.length > 0) {
                res.render('marca/editar-marca', {
                    marca: marcas[0]
                });
            } else {
                res.status(404).send("Marca no encontrada");
            }
        });
    });
};

// Función para actualizar una marca existente en la base de datos
const actualizarMarca = (req, res) => {
    const id_Marca = req.params.id_Marca;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.json(err);
        }

        conn.query('UPDATE Marca SET ? WHERE Id_Marca = ?', [data, id_Marca], (err, rows) => {
            if (err) {
                console.error('Error al actualizar marca', err);
                return res.status(500).json({ message: 'Error al actualizar marca', error: err.message });
            } else {
                res.redirect('/verMarcas');
            }
        });
    });
};

// Función para eliminar una marca de la base de datos
const eliminarMarca = (req, res) => {
    const id_Marca = req.body.id_Marca;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Marca WHERE Id_Marca = ?', [id_Marca], (err, rows) => {
            res.redirect('/verMarcas');
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
