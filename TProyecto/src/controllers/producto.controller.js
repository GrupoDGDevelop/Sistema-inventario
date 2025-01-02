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
            "nombre": "Modelo",
            "tipoDato": "text",
            "num_caracteres_min": 0,
            "num_caracteres_max": 40,
            "opcional": false
        },
        {
            "nombre": "Serie",
            "tipoDato": "text",
            "num_caracteres_min": 0,
            "num_caracteres_max": 40,
            "opcional": false
        },
        {
            "nombre": "Precio (MXN)",
            "tipoDato": "number",
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
                    tipoDato: caracteristicaProducto.tipoDato,
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
1
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

// Función para obtener productos desde la base de datos
async function verProductos(req, res) {
    try {
        const db = mongoose.connection.db; // Conexión a la base de datos
        const collection = db.collection('productos'); // Nombre de la colección

        // Obtener todos los documentos de la colección "productos"
        const productos = await collection.find().toArray();

        // Transformar datos si es necesario
        const productosTransformados = productos.map(producto => ({
            ID_Producto: producto._id,
            Nom_Producto: producto.tipoProducto,
            Modelo: producto.caracteristicas.find(c => c.nombre === "Modelo")?.valor || "N/A",
            Caracteristicas: producto.caracteristicas.map(c => `${c.nombre}: ${c.valor}`).join(", "),
            Precio_Total: producto.caracteristicas.find(c => c.nombre === "Precio")?.valor 
              || producto.caracteristicas.find(c => c.nombre === "Precio (MXN)")?.valor 
              || "N/A",
            Nom_Marca: producto.Fk_Marca || "N/A",
            Nom_Proveedor: producto.Fk_Proveedor || "N/A",
        }));

        // Enviar los productos al frontend
        res.status(200).json({ productos: productosTransformados });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos", error });
    }
}

async function editarProductos(req, res) {
    const id_P = req.params.id_P;
    console.log("ID del producto recibido:", id_P);
    const respuestaJson = req.query.json === 'true'; // Verifica si debe responder con JSON

    try {
        // Buscar el producto en MongoDB
        const producto = await mongoose.connection.db.collection('productos').findOne({ _id: new mongoose.Types.ObjectId(id_P) });

        if (!producto) {
            const errorMensaje = { error: "Producto no encontrado" };
            return respuestaJson ? res.status(404).json(errorMensaje) : res.status(404).render('error', errorMensaje);
        }

        // Consulta MongoDB: tipos de productos
        const tiposProductos = await mongoose.connection.db.collection('tipos_productos').find({
            tipo_producto: { $ne: 'producto_base' }
        }).toArray();

        // Obtener las marcas y proveedores desde MySQL
        req.getConnection((err, conn) => {
            if (err) {
                const errorMensaje = { error: "Error interno del servidor" };
                console.error("Error al conectar con MySQL:", err);
                return respuestaJson ? res.status(500).json(errorMensaje) : res.status(500).render('error', errorMensaje);
            }

            const marcasQuery = 'SELECT * FROM Marca';
            const proveedoresQuery = 'SELECT * FROM Proveedor';

            conn.query(marcasQuery, (err, marcas) => {
                if (err) {
                    const errorMensaje = { error: "Error al obtener marcas" };
                    console.error("Error al obtener marcas:", err);
                    return respuestaJson ? res.status(500).json(errorMensaje) : res.status(500).render('error', errorMensaje);
                }

                conn.query(proveedoresQuery, (err, proveedores) => {
                    if (err) {
                        const errorMensaje = { error: "Error al obtener proveedores" };
                        console.error("Error al obtener proveedores:", err);
                        return respuestaJson ? res.status(500).json(errorMensaje) : res.status(500).render('error', errorMensaje);
                    }

                    // Construcción del objeto de respuesta
                    const data = {
                        product: {
                            ID_Producto: producto._id,
                            Nom_Producto: producto.tipoProducto,
                            Modelo: producto.caracteristicas.find(c => c.nombre === "Modelo")?.valor || "N/A",
                            Caracteristicas: producto.caracteristicas,
                            Fk_Marca: producto.Fk_Marca,
                            Fk_Proveedor: producto.Fk_Proveedor,
                            Precio_Total: producto.caracteristicas.find(c => c.nombre === "Precio")?.valor || producto.caracteristicas.find(c => c.nombre === "Precio (MXN)")?.valor || "N/A",
                            Nota: producto.nota || "N/A"
                        },
                        marcas: marcas.map(marca => ({
                            Id_Marca: marca.Id_Marca,
                            Nom_Marca: marca.Nom_Marca
                        })),
                        proveedores: proveedores.map(proveedor => ({
                            Id_Proveedor: proveedor.Id_Proveedor,
                            Nom_Proveedor: proveedor.Nom_Proveedor
                        })),
                        tiposProductos
                    };

                    // Responder con JSON o renderizar la vista
                    if (respuestaJson) {
                        res.json(data);
                    } else {
                        res.render('producto/editar-producto', data);
                    }
                });
            });
        });
    } catch (error) {
        console.error("Error al cargar el producto para editar:", error);
        const errorMensaje = { error: "Error interno del servidor" };
        return respuestaJson ? res.status(500).json(errorMensaje) : res.status(500).render('error', errorMensaje);
    }
}

async function actualizarProducto(req, res) {
    const id_P = req.body.id_P;
    const data = req.body;

    try {
        // Conexión a la base de datos
        const db = mongoose.connection.db;
        const collection = db.collection('productos');

        // Actualizar el producto en la base de datos
        const result = await collection.updateOne({ _id: new mongoose.Types.ObjectId(id_P) }, { $set: data });

        if (result.modifiedCount === 1) {
            console.log(`Producto con ID ${id_P} actualizado exitosamente`);
            // Enviar una respuesta JSON al frontend
            res.status(200).json({ message: 'Producto actualizado exitosamente' });
        } else {
            console.log(`Producto con ID ${id_P} no encontrado o no se pudo actualizar`);
            res.status(404).json({ message: 'Producto no encontrado o no actualizado' });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        // Enviar una respuesta de error en formato JSON
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
}



function print(req, res) {
    // Inserta un nuevo producto en la base de datos y redirige a la lista de productos.
    res.redirect('/verProducto');
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

const { ObjectId } = require('mongodb');

async function eliminarP(req, res) {
    const id_P = req.body.id_P; // El ID del producto a eliminar

    if (!ObjectId.isValid(id_P)) {
        console.error(`ID inválido: ${id_P}`);
        return res.status(400).send('ID inválido');
    }

    try {
        // Conexión directa a la base de datos usando Mongoose
        const db = mongoose.connection.db;

        // Eliminar el producto con el ID proporcionado
        const result = await db.collection('productos').deleteOne({ _id: new ObjectId(id_P) });

        if (result.deletedCount === 1) {
            console.log(`Producto con ID ${id_P} eliminado exitosamente`);
        } else {
            console.log(`Producto con ID ${id_P} no encontrado`);
        }

        // Redirigir a la lista de productos
        res.redirect('/verProducto');
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(500).send('Error al eliminar producto');
    }
}

module.exports = {
    verProducto: verProducto,
    buscarP: buscarP,
    crearP: crearP,
    obtenerCaracteristicas: obtenerCaracteristicas,
    agregarTipoProducto : agregarTipoProducto,
    agregarCaracteristica : agregarCaracteristica,
    agregarProducto : agregarProducto,
    verProductos : verProductos,
    editarProductos : editarProductos,
    actualizarProducto : actualizarProducto,
    unicas : unicas,
    print: print,
    actualizar: actualizar,
    editarP: editarP,
    eliminarP: eliminarP,
};
