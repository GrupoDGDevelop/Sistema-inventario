// report.controller.js
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// Ver todas las cartas registradas
function verCarta(req, res) {
    const db = mongoose.connection; // Obtener la conexión de mongoose
    const collection = db.collection('cartas_responsivas'); // Acceder a la colección 'cartas_responsivas'

    collection.find({}).toArray()
        .then(cartas => {
            if (!cartas) {
                return res.status(404).json({ message: 'No se encontraron cartas responsivas.' });
            }

            // Renderizar la vista y pasar las cartas
            res.render('cartaR/ver-carta', { cartas });
            
        })
        .catch(err => {
            console.error('Error al obtener cartas responsivas:', err);
            res.status(500).json({ message: 'Error al obtener cartas responsivas', error: err });
        });
}


// Buscar cartas por un término específico (Resumen)
function buscarCarta(req, res) {
    const searchTerm = req.body.searchTerm; // Obtén el término de búsqueda desde el formulario

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }

        // Ajustamos la consulta para buscar coincidencias parciales en el campo "Resumen"
        const query = `
            SELECT 
                carta_r.*,
                producto.Nom_Producto,
                sistemas.Nom_Software,
                agencia.Nom_Agencia,
                usuario.Nombre_U
            FROM 
                carta_r 
            JOIN producto ON carta_r.Fk_Producto = producto.ID_Producto
            JOIN sistemas ON carta_r.Fk_Sistema = sistemas.ID_Sistemas
            JOIN agencia ON carta_r.Fk_Agencia = agencia.Id_Area
            JOIN usuario ON carta_r.Fk_Usuario = usuario.ID_Usuario
            WHERE carta_r.Resumen LIKE ?;
        `;

        conn.query(query, [`%${searchTerm}%`], (err, cartas) => {
            if (err) {
                console.error('Error al buscar cartas:', err);
                return res.status(500).send('Error al buscar cartas');
            }

            // Renderizamos la vista con los resultados filtrados
            res.render('cartaR/ver-carta', { cartas });
        });
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
