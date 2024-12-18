const mongoose = require('mongoose');


function verProducto(req, res) {
    // Obtiene y muestra todos los productos, incluyendo su marca y proveedor relacionados.
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
    // Busca productos que coincidan con el término ingresado por el usuario.
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

async function crearP(req, res) {
    try {
        const db = mongoose.connection.db; // Conexión directa a MongoDB

        // Consultas SQL para obtener marcas y proveedores
        req.getConnection(async (err, conn) => {
            if (err) return res.json(err);

            const queryMarcas = 'SELECT Id_Marca, Nom_Marca FROM Marca';
            const queryProveedores = 'SELECT Id_Proveedor, Nom_Proveedor FROM Proveedor';

            const marcas = await new Promise((resolve, reject) => {
                conn.query(queryMarcas, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            const proveedores = await new Promise((resolve, reject) => {
                conn.query(queryProveedores, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });

            // Consulta MongoDB: tipos de productos
            const tiposProductos = await db.collection('tipos_productos').find({
                tipo_producto: { $ne: 'producto_base' }
            }).toArray();          

            // Renderiza la vista con todos los datos necesarios
            res.render('producto/crear-producto', { marcas, proveedores, tiposProductos });
        });
    } catch (err) {
        console.error('Error al obtener los tipos de productos:', err);
        res.status(500).json({ error: 'Error al obtener los tipos de productos' });
    }
}

// Nueva función para obtener características según tipo de producto seleccionado
async function obtenerCaracteristicas(req, res) {
    const tipoProducto = req.params.tipoProducto;

    try {
        const db = mongoose.connection.db; // Conexión a MongoDB
        const tipoProductoData = await db.collection('tipos_productos')
            .findOne({ tipo_producto: tipoProducto });

        if (!tipoProductoData) {
            return res.status(404).json({ error: 'Tipo de producto no encontrado' });
        }

        res.json(tipoProductoData.caracteristicas);
    } catch (err) {
        console.error('Error al obtener características:', err);
        res.status(500).json({ error: 'Error al obtener las características' });
    }
}

async function unicas(req, res) {
    try {
        // Conexión directa a la base de datos
        const db = mongoose.connection.db; // Conexión a MongoDB
        const collection = db.collection('tipos_productos'); // Nombre de la colección en tu base de datos

        // Consulta para obtener las características únicas
        const resultado = await collection.aggregate([
            { $unwind: "$caracteristicas" }, // Descomponemos el array de características
            { $group: { _id: "$caracteristicas.caracteristica" } }, // Agrupamos por característica
            { $project: { _id: 0, caracteristica: "$_id" } }, // Seleccionamos solo el campo `caracteristica`
            { $sort: { caracteristica: 1 } } // Ordenamos alfabéticamente
        ]).toArray(); // Convertimos el cursor a un array

        // Enviamos la respuesta al cliente
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener características únicas:", error);
        res.status(500).json({ mensaje: "Error al obtener características únicas", error });
    }
}

// Función para agregar un nuevo tipo de producto con características
async function agregarTipoProducto(req, res) {
    const tipoProducto = req.body.tipoProducto; // Recibe la cadena para el tipo de producto
    const caracteristicas = [
        {
            "caracteristica": "Modelo",
            "tipo_valor": "text",
            "num_caracteres_min": 0,
            "num_caracteres_max": 40,
            "opcional": false
        },
        {
            "caracteristica": "Serie",
            "tipo_valor": "text",
            "num_caracteres_min": 0,
            "num_caracteres_max": 40,
            "opcional": false
        },
        {
            "caracteristica": "Precio",
            "tipo_valor": "number",
            "num_caracteres_min": 0,
            "num_caracteres_max": 40,
            "opcional": false
        }
    ]; // Características por defecto de "grupo_base"

    try {
        const db = mongoose.connection.db; // Conexión a MongoDB

        // Crear el documento que se agregará a la base de datos
        const nuevoTipoProducto = {
            tipo_producto: tipoProducto,
            caracteristicas: caracteristicas
        };

        // Insertar el nuevo tipo de producto en la colección 'tipos_productos'
        const result = await db.collection('tipos_productos').insertOne(nuevoTipoProducto);

        // Responder con el documento insertado
        res.status(201).json({
            message: 'Tipo de producto agregado exitosamente',
            _id: result.insertedId,
            tipo_producto: tipoProducto,
            caracteristicas: caracteristicas
        });
    } catch (err) {
        console.error('Error al agregar tipo de producto:', err);
        res.status(500).json({ error: 'Error al agregar el tipo de producto' });
    }
}

async function agregarCaracteristica(req, res) {
    try {
        const { nombreCaracteristica, tipoValor, numCaracteresMin, numCaracteresMax, opcional } = req.body;

        // Conexión directa a la base de datos
        const db = mongoose.connection.db; // Conexión a MongoDB
        const collection = db.collection('tipos_productos'); // Nombre de la colección en tu base de datos

        // Buscar el producto "producto_base"
        const productoBase = await collection.findOne({ tipo_producto: 'producto_base' });

        if (!productoBase) {
            return res.status(404).json({ mensaje: 'Producto base no encontrado' });
        }

        // Crear la nueva característica
        const nuevaCaracteristica = {
            caracteristica: nombreCaracteristica,
            tipo_valor: tipoValor,
            num_caracteres_min: numCaracteresMin,
            num_caracteres_max: numCaracteresMax,
            opcional: true
        };

        // Agregar la nueva característica al arreglo de características
        productoBase.caracteristicas.push(nuevaCaracteristica);

        // Actualizar el documento en la base de datos
        await collection.updateOne(
            { tipo_producto: 'producto_base' },
            { $set: { caracteristicas: productoBase.caracteristicas } }
        );

        // Enviar respuesta de éxito
        res.status(200).json({ mensaje: 'Característica agregada exitosamente', caracteristicas: productoBase.caracteristicas });
    } catch (error) {
        console.error("Error al agregar la característica:", error);
        res.status(500).json({ mensaje: "Error al agregar la característica", error });
    }
}

async function agregarProducto(req, res) {
    try {
        // Conexión a la base de datos
        const db = mongoose.connection.db;
        const productosCollection = db.collection('productos');
        const tiposProductosCollection = db.collection('tipos_productos');

        // Extraer los datos del cuerpo de la solicitud
        const { tipoProducto, caracteristicas, Fk_Marca, Fk_Proveedor, nota } = req.body;

        // Validar los datos requeridos
        if (!tipoProducto || !Fk_Marca || !Fk_Proveedor || !nota) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        // Buscar el tipo de producto en la colección `tipos_productos`
        const tipoProductoData = await tiposProductosCollection.findOne({ tipo_producto: tipoProducto });

        if (!tipoProductoData) {
            return res.status(404).json({ message: `El tipo de producto '${tipoProducto}' no existe en la base de datos.` });
        }

        // Validar y completar las características del producto
        const caracteristicasTipoProducto = tipoProductoData.caracteristicas || [];
        const nuevasCaracteristicas = [...caracteristicas]; // Clonar las características enviadas
        const caracteristicasFaltantes = []; // Para agregar nuevas características a `tipos_productos`

        for (const caracteristicaProducto of caracteristicas) {
            // Verificar si la característica está en `tipos_productos`
            const existe = caracteristicasTipoProducto.some(
                c => c.caracteristica === caracteristicaProducto.nombre
            );

            if (!existe) {
                // Si no existe, agregarla a `tipos_productos`
                caracteristicasFaltantes.push({
                    caracteristica: caracteristicaProducto.nombre,
                    tipo_valor: caracteristicaProducto.tipoDato,
                    num_caracteres_min: caracteristicaProducto.num_caracteres_min || 0,
                    num_caracteres_max: caracteristicaProducto.num_caracteres_max || 255,
                    opcional: caracteristicaProducto.opcional || false
                });
            }
        }

        // Actualizar el tipo de producto con nuevas características si hay alguna faltante
        if (caracteristicasFaltantes.length > 0) {
            await tiposProductosCollection.updateOne(
                { tipo_producto: tipoProducto },
                { $push: { caracteristicas: { $each: caracteristicasFaltantes } } }
            );
        }

        // Crear el objeto del nuevo producto con características validadas
        const nuevoProducto = {
            tipoProducto,
            caracteristicas: nuevasCaracteristicas,
            Fk_Marca,
            Fk_Proveedor,
            nota
        };

        // Insertar el nuevo producto en la colección `productos`
        const resultado = await productosCollection.insertOne(nuevoProducto);

        // Responder con éxito
        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto: { _id: resultado.insertedId, ...nuevoProducto }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
}



function print(req, res) {
    // Inserta un nuevo producto en la base de datos y redirige a la lista de productos.
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
    // Carga los datos de un producto específico para editar, junto con las listas de marcas y proveedores.
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
    // Actualiza los datos de un producto específico en la base de datos.
    const id_P = req.params.id_P;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.status(500).send('Error de conexión');
        }

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
    // Elimina un producto específico de la base de datos y redirige a la lista de productos.
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
    obtenerCaracteristicas: obtenerCaracteristicas,
    agregarTipoProducto : agregarTipoProducto,
    agregarCaracteristica : agregarCaracteristica,
    agregarProducto : agregarProducto,
    unicas : unicas,
    print: print,
    actualizar: actualizar,
    editarP: editarP,
    eliminarP: eliminarP,
};
