// cartaR.controller.js
function crearCarta(req, res) {
    req.getConnection((err, conn) => {
        if (err) return res.json(err);

        const queries = {
            agencias: 'SELECT * FROM agencia',
            usuarios: 'SELECT * FROM usuario',
            sistemas: 'SELECT * FROM sistemas',
            productos: `SELECT producto.*, marca.Nom_Marca, proveedor.Nom_Proveedor FROM producto 
                        JOIN marca ON producto.Fk_Marca = marca.Id_Marca 
                        JOIN proveedor ON producto.Fk_Proveedor = proveedor.Id_Proveedor`
        };

        conn.query(queries.agencias, (err, agencias) => {
            if (err) return res.json(err);

            conn.query(queries.usuarios, (err, usuarios) => {
                if (err) return res.json(err);

                conn.query(queries.sistemas, (err, sistemas) => {
                    if (err) return res.json(err);

                    conn.query(queries.productos, (err, productos) => {
                        if (err) return res.json(err);

                        const fechaActual = new Date().toISOString(); // Obtener la fecha actual
                        res.render('cartaR/crear-carta', {
                            agencias,
                            usuarios,
                            sistemas,
                            productos,
                            fechaActual // Incluir la fecha actual en el renderizado
                        });
                    });
                });
            });
        });
    });
}

function guardarCarta(req, res) {
    const data = {
        Fk_Producto: req.body.Fk_Producto,
        Fk_Sistema: req.body.Fk_Sistema,
        Fk_Agencia: req.body.Fk_Agencia,
        Fk_Usuario: req.body.Fk_Usuario,
        Num_Serie: req.body.Num_Serie,
        Resumen: req.body.Resumen,
        FechaU: req.body.FechaU
    };

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error al conectar con la base de datos');
        }

        conn.query('INSERT INTO carta_r SET ?', [data], (err) => {
            if (err) {
                console.error('Error al insertar Carta R:', err);
                return res.status(500).send('Error al guardar Carta R');
            }
            res.redirect('/verCartaR');
        });
    });
}

function obtenerDatos(req, res) {
    const tipo = req.params.tipo;
    const id = req.params.id;

    let query = '';
    let responseFields = {};

    if (tipo === 'producto') {
        query = `SELECT producto.Modelo, producto.Precio_Total, producto.Caracteristicas, 
                proveedor.Nom_Proveedor, marca.Nom_Marca
                FROM producto
                JOIN proveedor ON producto.Fk_Proveedor = proveedor.Id_Proveedor
                JOIN marca ON producto.Fk_Marca = marca.Id_Marca
                WHERE producto.ID_Producto = ?`;
        responseFields = {
            modelo: 'Modelo',
            precio_total: 'Precio_Total',
            caracteristicas: 'Caracteristicas',
            proveedor: 'Nom_Proveedor',
            marca: 'Nom_Marca'
        };
    } else if (tipo === 'sistema') {
        query = `SELECT Licencia, Version FROM sistemas WHERE ID_Sistemas = ?`;
        responseFields = {
            licencia: 'Licencia',
            version: 'Version'
        };
    } else if (tipo === 'agencia') {
        query = `SELECT Num_Agencia, Departamento FROM agencia WHERE Id_Area = ?`;
        responseFields = {
            num_agencia: 'Num_Agencia',
            departamento: 'Departamento'
        };
    } else if (tipo === 'usuario') {
        query = `SELECT * FROM usuario WHERE ID_Usuario = ?`;
        responseFields = {
            apellido: 'Apellido_U'
        };
    } else {
        return res.status(400).json({ success: false, message: 'Tipo de datos desconocido' });
    }

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ success: false, message: 'Error de conexión' });

        conn.query(query, [id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Error en la consulta' });

            if (results.length > 0) {
                const data = results[0];
                const responseData = {};

                // Mapear los campos de respuesta de acuerdo con responseFields
                Object.keys(responseFields).forEach(key => {
                    responseData[key] = data[responseFields[key]] || '';
                });

                res.json({ success: true, ...responseData });
            } else {
                res.status(404).json({ success: false, message: 'Datos no encontrados' });
            }
        });
    });
}

function editarCarta(req, res) {
    const id_Carta = req.params.id_Carta; // ID de la carta a editar
    req.getConnection((err, conn) => {
        if (err) return res.json(err);

        // Consulta principal para obtener la carta por ID
        const readCartaQuery = `SELECT * FROM carta_r WHERE ID_Carta_R = ?`;
        
        conn.query(readCartaQuery, [id_Carta], (err, carta) => {
            if (err) return res.json(err);

            if (carta.length > 0) {
                // Consultas adicionales para obtener datos relacionados
                const agenciasQuery = 'SELECT * FROM agencia';
                const usuariosQuery = 'SELECT * FROM usuario';
                const sistemasQuery = 'SELECT * FROM sistemas';
                const productosQuery = `
                    SELECT p.*, m.Nom_Marca, pr.Nom_Proveedor
                    FROM producto p
                    LEFT JOIN marca m ON p.Fk_Marca = m.Id_Marca
                    LEFT JOIN proveedor pr ON p.Fk_Proveedor = pr.Id_Proveedor`;

                conn.query(agenciasQuery, (err, agencias) => {
                    if (err) return res.json(err);

                    conn.query(usuariosQuery, (err, usuarios) => {
                        if (err) return res.json(err);

                        conn.query(sistemasQuery, (err, sistemas) => {
                            if (err) return res.json(err);

                            conn.query(productosQuery, (err, productos) => {
                                if (err) return res.json(err);

                                // Renderizamos la vista con los datos obtenidos
                                res.render('cartaR/editar-carta', {
                                    carta: carta[0],
                                    agencias,
                                    usuarios,
                                    sistemas,
                                    productos
                                });
                            });
                        });
                    });
                });
            } else {
                res.status(404).send("Carta no encontrada");
            }
        });
    });
}

function actualizarCarta(req, res) {
    const id_Carta = req.params.id_Carta;
    const { Num_Serie, Resumen, Fk_Agencia, Fk_Usuario, Fk_Sistema, Fk_Producto } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.json(err);

        const queryUpdateCarta = `
            UPDATE carta_r 
            SET Num_Serie = ?, Resumen = ?, Fk_Agencia = ?, Fk_Usuario = ?, Fk_Sistema = ?, Fk_Producto = ?
            WHERE ID_Carta_R = ?`;

        conn.query(queryUpdateCarta, [Num_Serie, Resumen, Fk_Agencia, Fk_Usuario, Fk_Sistema, Fk_Producto, id_Carta], (err, result) => {
            if (err) return res.json(err);

            res.redirect(`/verCartaR`);
        });
    });
}

function eliminarCarta(req, res) {
    const id_Carta = req.body.id_Carta;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error de conexión con la base de datos');
        }

        conn.query('DELETE FROM carta_r WHERE ID_Carta_R = ?', [id_Carta], (err) => {
            if (err) {
                console.error('Error al eliminar Carta R:', err);
                return res.status(500).send('Error al eliminar Carta R');
            }
            res.redirect('/verCartaR');
        });
    });
}

module.exports = {
    crearCarta: crearCarta,
    obtenerDatos: obtenerDatos,
    guardarCarta: guardarCarta,
    editarCarta: editarCarta,
    actualizarCarta: actualizarCarta,
    eliminarCarta: eliminarCarta
};
