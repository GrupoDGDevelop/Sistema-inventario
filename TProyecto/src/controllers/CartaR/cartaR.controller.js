// cartaR.controller.js
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.memoryStorage(); // Usar memoria en lugar de archivo físico
const upload = multer({ storage: storage });

// Función para mostrar el formulario de creación de una Carta R
function crearCarta(req, res) {
    req.getConnection((err, conn) => {
        if (err) return res.json(err);
        console.log('Creando Carta R');

        // Consultas para obtener datos de diferentes tablas
        const queries = {
            agencias: 'SELECT * FROM agencia',
            usuarios: 'SELECT * FROM usuario',
            sistemas: 'SELECT * FROM sistemas',
        };

        // Ejecutar las consultas una por una, comenzando por las agencias
        conn.query(queries.agencias, (err, agencias) => {
            if (err) return res.json(err);

            conn.query(queries.usuarios, (err, usuarios) => {
                if (err) return res.json(err);

                conn.query(queries.sistemas, (err, sistemas) => {
                    if (err) return res.json(err);


                        // Obtener la fecha actual en formato ISO
                        const fechaActual = new Date().toISOString();
                        // Renderizar la vista de creación de Carta R con los datos obtenidos
                        res.render('cartaR/crear-carta', {
                            agencias,
                            usuarios,
                            sistemas,
                            fechaActual // Incluir la fecha actual en el renderizado
                        });
                });
            });
        });
    });
}

// Función para guardar una nueva Carta R
async function guardarCarta(req, res) {
    try {
        const db = mongoose.connection; //conexion a la base de datos mongodb
        const collection = db.collection('cartas_responsivas'); //nombre de la coleccion

        console.log('Guardando Carta R:', req.body);

        const data = {
            Fk_Producto: req.body.Fk_Producto,
            Fk_Sistema: req.body.Fk_Sistema,
            Fk_Agencia: req.body.Fk_Agencia,
            Fk_Usuario: req.body.Fk_Usuario,
            Resumen: req.body.Resumen,
            FechaU: new Date(req.body.FechaU),
            id_CartaR: req.body.id_CartaR,
            estado: "Inactiva",
            tienePDF: false
        };

        const resultado = await collection.insertOne(data);

        console.log('Carta responsiva guardada con éxito:', resultado.insertedId);

        // Renderizar la vista 'verCartaR' pasando los datos guardados
        // Enviar un error y renderizar la misma vista con un mensaje de error
        res.redirect('/verCartaR');
    } catch (error) {
        console.error('Error al guardar la Carta R:', error);
        // Enviar un error y renderizar la misma vista con un mensaje de error
        res.redirect('/verCartaR');
    }
} 

// Función para obtener los datos de un producto, sistema, agencia o usuario por su ID
function obtenerDatos(req, res) {
    const tipo = req.params.tipo; // Tipo de dato (producto, sistema, agencia, usuario)
    const id = req.params.id; // ID del elemento

    let query = '';
    let responseFields = {}; // Campos de respuesta

    // Dependiendo del tipo, asignar la consulta SQL y los campos de respuesta
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
        // Si el tipo no es válido, devolver error
        return res.status(400).json({ success: false, message: 'Tipo de datos desconocido' });
    }

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ success: false, message: 'Error de conexión' });

        // Ejecutar la consulta SQL para obtener los datos
        conn.query(query, [id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Error en la consulta' });

            // Si se encontraron resultados, mapear los campos
            if (results.length > 0) {
                const data = results[0];
                const responseData = {};

                // Mapear los campos de respuesta de acuerdo con responseFields
                Object.keys(responseFields).forEach(key => {
                    responseData[key] = data[responseFields[key]] || '';
                });

                res.json({ success: true, ...responseData });
            } else {
                // Si no se encontraron resultados, devolver error 404
                res.status(404).json({ success: false, message: 'Datos no encontrados' });
            }
        });
    });
}

// Función para editar una Carta R
async function editarCarta(req, res) {
    const id_Carta = req.params.id_Carta; // ID de la carta a editar

    try {
        const db = mongoose.connection; // Conexión a la base de datos MongoDB
        const collectionCartas = db.collection('cartas_responsivas'); // Colección de cartas
        const collectionProductos = db.collection('productos'); // Colección de productos

        // Buscar la carta en la colección por su _id
        const carta = await collectionCartas.findOne({ _id: new mongoose.Types.ObjectId(id_Carta) });

        if (!carta) {
            // Si la carta no fue encontrada, devolver error 404
            return res.status(404).send("Carta no encontrada");
        }

        // Obtener los productos relacionados desde la colección MongoDB
        const idsProductos = carta.Fk_Producto.map(prod => new mongoose.Types.ObjectId(prod._id));
        const productos = await collectionProductos.find({ _id: { $in: idsProductos } }).toArray();

        // Formatear los productos para que coincidan con la estructura esperada
        const productosFormateados = productos.map(producto => ({
            tipoProducto: producto.tipoProducto,
            Fk_Marca: producto.Fk_Marca,
            Fk_Proveedor: producto.Fk_Proveedor,
            nota: producto.nota,
            caracteristicas: producto.caracteristicas.map(carac => ({
                nombre: carac.nombre,
                valor: carac.valor,
                tipoDato: carac.tipoDato
            }))
        }));

        // Verificar si la carta tiene un archivo PDF
        let pdfBase64 = null;
        if (carta.cartaPDF) {
            pdfBase64 = carta.cartaPDF.buffer.toString('base64'); // Convertir el Buffer a base64
        }

        // Realizar las consultas SQL adicionales
        req.getConnection((err, conn) => {
            if (err) return res.json(err);

            const agenciasQuery = 'SELECT * FROM agencia';
            const usuariosQuery = 'SELECT * FROM usuario';
            const sistemasQuery = 'SELECT * FROM sistemas';

            conn.query(agenciasQuery, (err, agencias) => {
                if (err) return res.json(err);

                conn.query(usuariosQuery, (err, usuarios) => {
                    if (err) return res.json(err);

                    conn.query(sistemasQuery, (err, sistemas) => {
                        if (err) return res.json(err);

                        // Renderizar la vista de edición de Carta R con los datos obtenidos
                        res.render('cartaR/editar-carta', {
                            carta, // La carta obtenida de MongoDB
                            agencias,
                            usuarios,
                            sistemas,
                            productos: productosFormateados, // Productos obtenidos y formateados de MongoDB
                            pdfBase64  // PDF incluido en los datos
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
}



// Función para actualizar una Carta Responsiva
async function actualizarCarta(req, res) {
    const id_Carta = req.params.id_Carta; // ID de la carta a actualizar
    console.log('Actualizando Carta R:', req.body);

    // Obtener los datos del formulario (cartaResponsiva)
    let cartaResponsiva = req.body.cartaResponsiva ? JSON.parse(req.body.cartaResponsiva) : {};

    // Asegúrate de que cartaResponsiva tiene los datos que necesitas
    const { Fk_Producto, Fk_Sistema, Fk_Agencia, Fk_Usuario, Resumen } = cartaResponsiva;

    // Si existe un archivo PDF, está disponible en req.file
    const cartaPDF = req.file ? req.file.buffer : null; // Aquí usamos el Buffer del archivo

    try {
        const db = mongoose.connection; // Conexión a MongoDB
        const collection = db.collection('cartas_responsivas'); // Colección de cartas

        // Validar si la carta existe
        const cartaExistente = await collection.findOne({ _id: new mongoose.Types.ObjectId(id_Carta) });
        if (!cartaExistente) {
            return res.status(404).send("Carta no encontrada");
        }

        // Estructura de los datos a actualizar
        const actualizacion = {
            Fk_Producto: Fk_Producto || cartaExistente.Fk_Producto,
            Fk_Sistema: {
                Nombre: Fk_Sistema.Nombre || cartaExistente.Fk_Sistema.Nombre,
                Licencia: Fk_Sistema.Licencia || cartaExistente.Fk_Sistema.Licencia,
                Version: Fk_Sistema.Version || cartaExistente.Fk_Sistema.Version
            },
            Fk_Agencia: {
                Nombre: Fk_Agencia.Nombre || cartaExistente.Fk_Agencia.Nombre,
                Num_Agencia: Fk_Agencia.Num_Agencia || cartaExistente.Fk_Agencia.Num_Agencia,
                Departamento: Fk_Agencia.Departamento || cartaExistente.Fk_Agencia.Departamento
            },
            Fk_Usuario: Fk_Usuario || cartaExistente.Fk_Usuario,
            Resumen: Resumen || cartaExistente.Resumen,
            cartaPDF: cartaPDF || cartaExistente.cartaPDF, // Guardamos el Buffer aquí
            estado: cartaResponsiva.estado || cartaExistente.estado, // Aquí se actualiza el estado si viene en el cuerpo
            tienePDF: !!cartaPDF // Indicar si la carta tiene un PDF
        };

        // Actualizar la carta en la colección
        const resultado = await collection.updateOne(
            { _id: new mongoose.Types.ObjectId(id_Carta) },
            { $set: actualizacion }
        );

        if (resultado.modifiedCount === 0) {
            return res.status(400).send("No se realizaron cambios en la carta");
        }

        // Redirigir después de la actualización
        res.redirect('/verCartaR');
    } catch (error) {
        console.error("Error al actualizar la carta:", error);
        res.status(500).send("Error al actualizar la carta");
    }
}


// Función para eliminar una Carta R
async function eliminarCarta(req, res) {
    const id_Carta = req.body.id_Carta; // ID de la carta que se va a eliminar

    try {
        const db = mongoose.connection; // Conexión a la base de datos MongoDB
        const collection = db.collection('cartas_responsivas'); // Nombre de la colección

        // Eliminar la carta por su ID
        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id_Carta) });

        if (result.deletedCount === 0) {
            console.error('Error: No se encontró la carta con el ID proporcionado.');
            return res.status(404).send('No se encontró la Carta R para eliminar');
        }

        // Redirigir al listado de cartas después de eliminar
        res.redirect('/verCartaR');

    } catch (err) {
        console.error('Error al eliminar la carta:', err);
        res.status(500).send('Error al eliminar Carta R');
    }
}

async function eliminarCartaPDF(req, res) {
    console.log('Eliminando PDF de la carta:', req.params);
    const cartaId = req.params.id; // Usar parámetro de la ruta para el _id del documento
    console.log('ID de la carta:', cartaId);

    try {
        const db = mongoose.connection.db;
        const collection = db.collection('cartas_responsivas');

        // Buscar el documento con el _id proporcionado
        const carta = await collection.findOne({ _id: new mongoose.Types.ObjectId(cartaId) });

        if (!carta) {
            return res.status(404).json({ mensaje: 'Carta no encontrada' });
        }

        // Verificar si la carta tiene un PDF antes de intentar eliminarlo
        if (!carta.cartaPDF || typeof carta.cartaPDF !== 'object') {
            return res.status(400).json({ mensaje: 'No se encuentra un PDF válido para eliminar en este documento.' });
        }


        // Eliminar el campo cartaPDF
        await collection.updateOne(
            { _id: new mongoose.Types.ObjectId(cartaId) },
            { $unset: { cartaPDF: "" } } // Utiliza $unset para eliminar el campo
        );

        res.status(200).json({ mensaje: 'PDF de la carta eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el PDF de la carta:", error);
        res.status(500).json({ mensaje: "Error al eliminar el PDF de la carta", error });
    }
}


// Exportar las funciones para usarlas en las rutas
module.exports = {
    crearCarta: crearCarta,
    guardarCarta: guardarCarta,
    obtenerDatos: obtenerDatos,
    editarCarta: editarCarta,
    actualizarCarta: actualizarCarta,
    eliminarCarta: eliminarCarta,
    eliminarCartaPDF: eliminarCartaPDF
};
