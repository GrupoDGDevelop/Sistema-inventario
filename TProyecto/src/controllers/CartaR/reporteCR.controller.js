// report.controller.js
const PDFDocument = require('pdfkit');

function verCarta(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al establecer la conexión:', err);
            return res.status(500).json(err);
        }

        const query = `
            SELECT 
                carta_r.*,
                producto.Nom_Producto,
                sistemas.Nom_Software,
                agencia.Nom_Agencia,
                usuario.Nombre_U
            FROM 
                carta_r JOIN producto ON carta_r.Fk_Producto = producto.ID_Producto
            JOIN sistemas ON carta_r.Fk_Sistema = sistemas.ID_Sistemas
            JOIN agencia ON carta_r.Fk_Agencia = agencia.Id_Area
            JOIN usuario ON carta_r.Fk_Usuario = usuario.ID_Usuario;
        `;

        conn.query(query, (err, cartas) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.json(err);
            }

            res.render('cartaR/ver-carta', { cartas });
        });
    });
}


function buscarCarta(req, res) {
    const searchTerm = req.body.searchTerm; // Obtén el término de búsqueda desde el formulario

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }

        // Ajustamos la consulta para buscar coincidencias parciales en el campo "Resumen"
        const query = `SELECT * FROM carta_r WHERE Resumen LIKE ?`;

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


// Nueva función: Redirigir a la vista `imprimir-carta.hbs`
function vistaImprimir(req, res) {
    const id_Carta = req.params.id_Carta;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error en la conexión a la base de datos");

        // Consulta para unir todas las tablas relacionadas con `carta_r`
        const query = `
            SELECT 
                cr.*,
                u.ID_Usuario, u.Nombre_U, u.Correo_U,
                a.Id_Area, a.Nom_Agencia, a.Num_Agencia, a.Departamento,
                s.ID_Sistemas, s.Nom_Software, s.Version, s.Licencia,
                p.ID_Producto, p.Nom_Producto, p.Modelo, p.Caracteristicas, p.Precio_Total,
                m.Id_Marca, m.Nom_Marca,
                pr.Id_Proveedor, pr.Nom_Proveedor
            FROM 
                carta_r cr
            LEFT JOIN usuario u ON cr.Fk_Usuario = u.ID_Usuario
            LEFT JOIN agencia a ON cr.Fk_Agencia = a.Id_Area
            LEFT JOIN sistemas s ON cr.Fk_Sistema = s.ID_Sistemas
            LEFT JOIN producto p ON cr.Fk_Producto = p.ID_Producto
            LEFT JOIN marca m ON p.Fk_Marca = m.Id_Marca
            LEFT JOIN proveedor pr ON p.Fk_Proveedor = pr.Id_Proveedor
            WHERE cr.ID_Carta_R = ?;
        `;

        conn.query(query, [id_Carta], (err, result) => {
            if (err) return res.status(500).send("Error al obtener datos de la Carta R");
            if (result.length === 0) return res.status(404).send("Carta R no encontrada");

            // Renderizamos la vista pasando los datos de la carta y tablas relacionadas
            res.render('cartaR/imprimir-carta', { 
                carta: result[0], 
                datos: result, 
                noLayout: true  // Pasar la variable noLayout para omitir la barra lateral y superior
            });
        });
    });
}

// Modificación de la función `imprimirCarta`: Generar el PDF
function imprimirCarta(req, res) {
    const id_Carta = req.params.id_Carta;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send("Error en la conexión a la base de datos");

        // Misma consulta SQL que en `vistaImprimir`
        const query = `
            SELECT 
                cr.*,
                u.Nombre_U, u.Apellido_U, u.Correo_U,
                a.Nom_Agencia, a.Num_Agencia, a.Departamento,
                s.Nom_Software, s.Version, s.Licencia,
                p.Nom_Producto, p.Modelo, p.Caracteristicas, p.Precio_Total,
                m.Nom_Marca,
                pr.Nom_Proveedor
            FROM 
                carta_r cr
            LEFT JOIN usuario u ON cr.Fk_Usuario = u.ID_Usuario
            LEFT JOIN agencia a ON cr.Fk_Agencia = a.Id_Area
            LEFT JOIN sistemas s ON cr.Fk_Sistema = s.ID_Sistemas
            LEFT JOIN producto p ON cr.Fk_Producto = p.ID_Producto
            LEFT JOIN marca m ON p.Fk_Marca = m.Id_Marca
            LEFT JOIN proveedor pr ON p.Fk_Proveedor = pr.Id_Proveedor
            WHERE cr.ID_Carta_R = ?;
        `;

        conn.query(query, [id_Carta], (err, result) => {
            if (err) return res.status(500).send("Error al obtener datos de la Carta R");
            if (result.length === 0) return res.status(404).send("Carta R no encontrada");

            const carta = result[0];

            // Configuración del PDF
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Carta_R_${id_Carta}.pdf"`);

            doc.pipe(res);

            // Encabezado
            doc.fontSize(18).text(`Carta R - ${carta.ID_Carta_R}`, { align: 'center' });
            doc.moveDown();

            // Sección: Datos del área
            doc.fontSize(14).text('Datos del Área', { underline: true });
            doc.fontSize(12).text(`Agencia: ${carta.Nom_Agencia || 'No especificada'}`);
            doc.text(`Número de Agencia: ${carta.Num_Agencia || 'No especificado'}`);
            doc.text(`Departamento: ${carta.Departamento || 'No especificado'}`);
            doc.moveDown();

            // Sección: Descripción del equipo
            doc.fontSize(14).text('Descripción del Equipo', { underline: true });
            doc.fontSize(12).text(`Producto: ${carta.Nom_Producto || 'No especificado'}`);
            doc.text(`Marca: ${carta.Nom_Marca || 'No especificada'}`);
            doc.text(`Modelo: ${carta.Modelo || 'No especificado'}`);
            doc.text(`Características: ${carta.Caracteristicas || 'No especificadas'}`);
            doc.text(`Precio Total: ${carta.Precio_Total || 'No especificado'}`);
            doc.moveDown();

            // Sección: Descripción del software
            doc.fontSize(14).text('Descripción del Software', { underline: true });
            doc.fontSize(12).text(`Software: ${carta.Nom_Software || 'No especificado'}`);
            doc.text(`Versión: ${carta.Version || 'No especificada'}`);
            doc.text(`Licencia: ${carta.Licencia || 'No especificada'}`);
            doc.moveDown();

            // Sección: Resumen
            doc.fontSize(14).text('Resumen', { underline: true });
            doc.fontSize(12).text(carta.Resumen || 'No especificado');
            doc.moveDown();

            // Finalizar el PDF
            doc.end();
        });
    });
}

module.exports = {
    verCarta: verCarta,
    buscarCarta: buscarCarta,
    vistaImprimir: vistaImprimir,
    imprimirCarta: imprimirCarta
};