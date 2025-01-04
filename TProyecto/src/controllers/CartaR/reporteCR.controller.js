// report.controller.js
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// Ver todas las cartas registradas
function verCarta(req, res) {
    const db = mongoose.connection; // Obtener la conexión de mongoose
    const collection = db.collection('cartas_responsivas'); // Acceder a la colección 'cartas_responsivas'

    // Obtener todas las cartas
    collection.find({}).toArray()
        .then(cartas => {
            if (!cartas) {
                return res.status(404).json({ message: 'No se encontraron cartas responsivas.' });
            }

            // Obtener valores únicos de proveedores, agencias, usuarios y números de agencia
            const proveedoresPromise = collection.distinct('Fk_Producto.Nom_Proveedor');
            const agenciasPromise = collection.distinct('Fk_Agencia.Nombre');
            const usuariosPromise = collection.distinct('Fk_Usuario');
            const numerosAgenciaPromise = collection.distinct('Fk_Agencia.Num_Agencia');
            const estadopPromise = collection.distinct('estado');
            const tienePDFsPromise = collection.distinct('tienePDF');

            // Ejecutar todas las promesas para obtener los valores únicos
            Promise.all([proveedoresPromise, agenciasPromise, usuariosPromise, numerosAgenciaPromise, estadopPromise, tienePDFsPromise])
                .then(([proveedores, agencias, usuarios, numerosAgencia, estados, tienePDFs]) => {
                    // Renderizar la vista y pasar las cartas, proveedores, agencias, usuarios y números de agencia
                    res.render('cartaR/ver-carta', {
                        cartas,
                        proveedores,
                        agencias,
                        usuarios,
                        numerosAgencia,
                        estados,
                        tienePDFs
                    });
                })
                .catch(err => {
                    console.error('Error al obtener valores únicos:', err);
                    res.status(500).json({ message: 'Error al obtener valores únicos', error: err });
                });
        })
        .catch(err => {
            console.error('Error al obtener cartas responsivas:', err);
            res.status(500).json({ message: 'Error al obtener cartas responsivas', error: err });
        });
}


// Buscar cartas con filtros específicos y coincidencias parciales para idCarta
function buscarCarta(req, res) {
    const db = mongoose.connection; // Conexión a MongoDB
    const collection = db.collection('cartas_responsivas'); // Colección de cartas

    // Obtener los filtros enviados desde el formulario
    const { idCarta, numeroAgencia, agencia, usuario, startDate, endDate, estado, tienePDF } = req.body;

    // Construir la consulta dinámica
    const query = {};

    if (idCarta && idCarta.trim() !== "") {
        query.id_CartaR = { $regex: idCarta, $options: "i" }; // Búsqueda parcial (insensible a mayúsculas/minúsculas)
    }

    if (numeroAgencia && numeroAgencia.trim() !== "") {
        query["Fk_Agencia.Num_Agencia"] = numeroAgencia; // Búsqueda exacta por número de agencia
    }

    if (agencia && agencia.trim() !== "") {
        query["Fk_Agencia.Nombre"] = agencia; // Búsqueda exacta por nombre de agencia
    }

    if (usuario && usuario.trim() !== "") {
        query.Fk_Usuario = usuario; // Búsqueda exacta por usuario
    }

    if (startDate || endDate) {
        query.FechaU = {};
        if (startDate) {
            query.FechaU.$gte = new Date(startDate); // Fecha desde
        }
        if (endDate) {
            query.FechaU.$lte = new Date(endDate); // Fecha hasta
        }
    }

    if (estado && estado.trim() !== "") {
        query.estado = estado; // Filtro exacto por estado
    }

    if (tienePDF && tienePDF.trim() !== "") {
        query.tienePDF = tienePDF === "true"; // Convertir el valor a booleano
    }

    // Buscar las cartas según los filtros
    collection.find(query).toArray()
        .then(cartas => {
            if (!cartas || cartas.length === 0) {
                cartas = []; // Asegurar que cartas sea un arreglo vacío si no hay resultados
            }

            // Obtener valores únicos de estados y tienePDFs para los filtros
            const estadosPromise = collection.distinct('estado');
            const tienePDFsPromise = collection.distinct('tienePDF');
            const proveedoresPromise = collection.distinct('Fk_Producto.Nom_Proveedor');
            const agenciasPromise = collection.distinct('Fk_Agencia.Nombre');
            const usuariosPromise = collection.distinct('Fk_Usuario');
            const numerosAgenciaPromise = collection.distinct('Fk_Agencia.Num_Agencia');

            // Ejecutar todas las promesas para obtener los valores únicos
            Promise.all([estadosPromise, tienePDFsPromise, proveedoresPromise, agenciasPromise, usuariosPromise, numerosAgenciaPromise])
                .then(([estados, tienePDFs, proveedores, agencias, usuarios, numerosAgencia]) => {
                    // Renderizar la vista y pasar las cartas, filtros y valores únicos
                    res.render('cartaR/ver-carta', {
                        cartas,
                        estados,
                        tienePDFs,
                        proveedores,
                        agencias,
                        usuarios,
                        numerosAgencia
                    });
                })
                .catch(err => {
                    console.error('Error al obtener valores únicos:', err);
                    res.status(500).json({ message: 'Error al obtener valores únicos', error: err });
                });
        })
        .catch(err => {
            console.error('Error al buscar cartas:', err);
            res.status(500).json({ message: 'Error al buscar cartas', error: err });
        });
}


// Redirigir a la vista `imprimir-carta.hbs` utilizando MongoDB
async function vistaImprimir(req, res) {
    const id_Carta = req.params.id_Carta; // Obtener el ID de la carta desde los parámetros
    console.log(id_Carta);

    try {
        const db = mongoose.connection; // Obtener la conexión de mongoose
        const collection = db.collection('cartas_responsivas'); // Acceder a la colección 'cartas_responsivas'

        // Buscar la carta en la base de datos usando id_CartaR
        const carta = await collection.findOne({ id_CartaR: id_Carta });
        console.log(carta);

        if (!carta) {
            return res.status(404).send("Carta R no encontrada");
        }

        // Renderizar la vista pasando los datos de la carta
        res.render('cartaR/imprimir-carta', { 
            carta,   // Pasamos la carta directamente a la vista
            noLayout: true  // Omitir la barra lateral y superior
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error al obtener datos de la Carta R");
    }
}

// Generar el PDF de la carta
function imprimirCarta(req, res) {
    const id_Carta = req.params.id_Carta;

    // Obtener la conexión de mongoose y acceder a la colección 'cartas_responsivas'
    const db = mongoose.connection;
    const collection = db.collection('cartas_responsivas');

    // Buscar la carta en la colección por su _id
    collection.findOne({ _id: new mongoose.Types.ObjectId(id_Carta) }, (err, carta) => {
        if (err) return res.status(500).send("Error en la conexión a la base de datos");
        if (!carta) return res.status(404).send("Carta no encontrada");
        
        // Configuración del PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Carta_R_${id_Carta}.pdf"`);

        doc.pipe(res);

        // Encabezado
        doc.fontSize(14).text(`Carta R - ${id_Carta}`, { align: 'center' });
        doc.moveDown();

        // Sección: Datos del área
        const agencia = carta.Fk_Agencia || {};
        doc.fontSize(10).text('Datos del Área', { underline: true });
        doc.fontSize(10).text(`Agencia: ${agencia.Nombre || 'No especificada'}`);
        doc.text(`Número de Agencia: ${agencia.Num_Agencia || 'No especificado'}`);
        doc.text(`Departamento: ${agencia.Departamento || 'No especificado'}`);
        doc.moveDown();

        // Sección: Descripción del equipo
        doc.fontSize(10).text('Descripción del Equipo', { underline: true });
        carta.Fk_Producto.forEach((producto, index) => {
            doc.fontSize(10).text(`Producto ${index + 1}: ${producto.Nom_Producto || 'No especificado'}`);
            doc.text(`Marca: ${producto.Nom_Marca || 'No especificada'}`);
            doc.text(`Modelo: ${producto.Modelo || 'No especificado'}`);
            // Separar características en líneas diferentes
            const caracteristicas = producto.Caracteristicas ? producto.Caracteristicas.split(', ') : ['No especificadas'];
            caracteristicas.forEach(caracteristica => {
                doc.text(`${caracteristica}`);
            });
            doc.text(`Precio Total: ${producto.Precio_Total || 'No especificado'}`);
            doc.moveDown();
        });

        // Sección: Descripción del software
        const sistema = carta.Fk_Sistema || {};
        doc.fontSize(10).text('Descripción del Software', { underline: true });
        doc.fontSize(10).text(`Software: ${sistema.Nombre || 'No especificado'}`);
        doc.text(`Versión: ${sistema.Version || 'No especificada'}`);
        doc.text(`Licencia: ${sistema.Licencia || 'No especificada'}`);
        doc.moveDown();

        // Sección: Resumen
        doc.fontSize(10).text('Resumen', { underline: true });
        doc.fontSize(10).text(carta.Resumen || 'No especificado');
        doc.moveDown();

        // Sección: Información adicional (Fecha y Usuario)
        const fecha = carta.FechaU ? new Date(carta.FechaU.$date).toLocaleString() : 'No especificada';
        doc.fontSize(10).text('Información Adicional', { underline: true });
        doc.fontSize(10).text(`Fecha de Última Actualización: ${fecha}`);
        doc.text(`Responsable: ${carta.Fk_Usuario || 'No especificado'}`);
        doc.moveDown();

        // Finalizar el PDF
        doc.end();
    });
}



module.exports = {
    verCarta: verCarta,
    buscarCarta: buscarCarta,
    vistaImprimir: vistaImprimir,
    imprimirCarta: imprimirCarta
};
