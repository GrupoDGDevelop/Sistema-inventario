function verProducto(req, res) {
    req.getConnection((err, conn) => {
        const read = `
            SELECT Producto.*, Marca.Nom_Marca, Proveedor.Nom_Proveedor 
            FROM Producto 
            JOIN Marca ON Producto.Fk_Marca = Marca.Id_Marca 
            JOIN Proveedor ON Producto.Fk_Proveedor = Proveedor.Id_Proveedor
            ORDER BY Producto.ID_Producto ASC;
        `;

        conn.query(read, (err, product) => {
            if (err) {
                res.json(err);
            }
            res.render('producto/producto', { product });
        });
    });
}

function buscarP(req, res) {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `
            SELECT Producto.*, Marca.Nom_Marca AS Marca, Proveedor.Nom_Proveedor AS Proveedor
            FROM Producto
            JOIN Marca ON Producto.FK_Marca = Marca.ID_Marca
            JOIN Proveedor ON Producto.FK_Proveedor = Proveedor.ID_Proveedor
            WHERE Producto.Nombre LIKE ?
        `;

        conn.query(query, [`%${searchTerm}%`], (err, product) => {
            if (err) {
                res.json(err);
            }
            res.render('producto/producto', { product });
        });
    });
}

function crearP(req, res) {
    req.getConnection((err, conn) => {
        if (err) return res.json(err);

        const queryMarcas = 'SELECT Id_Marca, Nom_Marca FROM Marca';
        const queryProveedores = 'SELECT Id_Proveedor, Nom_Proveedor FROM Proveedor';

        conn.query(queryMarcas, (err, marcas) => {
            if (err) return res.json(err);

            conn.query(queryProveedores, (err, proveedores) => {
                if (err) return res.json(err);

                res.render('producto/crear-producto', { marcas, proveedores });
            });
        });
    });
}

function print(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Producto SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar producto', err);
                return res.status(500).send('Error al Crear Producto');
            }
            res.redirect('/verProducto');
        });
    });
}

function editarP(req, res) {
    const id_P = req.params.id_P;
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Producto WHERE ID_Producto = ?`;

        conn.query(read, [id_P], (err, product) => {
            if (err) return res.json(err);

            if (product.length > 0) {
                const marcasQuery = 'SELECT * FROM Marca';
                const proveedoresQuery = 'SELECT * FROM Proveedor';

                conn.query(marcasQuery, (err, marcas) => {
                    if (err) return res.json(err);

                    conn.query(proveedoresQuery, (err, proveedores) => {
                        if (err) return res.json(err);

                        res.render('producto/editar-producto', {
                            product: product[0],
                            marcas,
                            proveedores
                        });
                    });
                });
            } else {
                res.status(404).send("Producto no encontrado");
            }
        });
    });
}

function actualizar(req, res) {
    const id_P = req.params.id_P;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.status(500).send('Error de conexión');
        }

        // Intentar actualizar
        conn.query('UPDATE producto SET ? WHERE ID_Producto = ?', [data, id_P], (err, rows) => {
            if (err) {
                console.error('Error al actualizar producto', err);
                return res.status(500).send('Error al actualizar producto');
            }

            if (rows.affectedRows === 0) {
                res.status(404).send("Producto no encontrado o no se pudo actualizar.");
            } else {
                res.redirect('/verProducto');
            }
        });
    });
}


function eliminarP(req, res) {
    const id_P = req.body.id_P;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Producto WHERE ID_Producto = ?', [id_P], (err, rows) => {
            res.redirect('/verProducto');
        });
    });
}

module.exports = {
    verProducto: verProducto,
    buscarP: buscarP,
    crearP: crearP,
    print: print,
    actualizar: actualizar,
    editarP: editarP,
    eliminarP: eliminarP,
};
