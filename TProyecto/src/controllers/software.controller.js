const verSoftware = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `
        SELECT * FROM Sistemas;
        `;
        conn.query(read, (err, sistemas) => {
            if (err) {
                res.json(err);
            }
            res.render('software/software', { sistemas });
        });
    });
};

const buscarS = (req, res) => {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `
            SELECT * FROM Sistemas
            WHERE Nom_Software LIKE ?
        `;

        conn.query(query, [`%${searchTerm}%`], (err, sistemas) => {
            if (err) {
                res.json(err);
            }
            res.render('software/software', { sistemas });
        });
    });
};

const crearS = (req, res) => {
    res.render('software/crear-software');
};

const printSoftware = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Sistemas SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Sistemas', err);
                return res.status(500).send('Error al Crear Sistema');
            } else {
                res.redirect('/verSoftware');
            }
        });
    });
};

const editarS = (req, res) => {
    const id_S = req.params.id_S;
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM Sistemas 
            WHERE ID_Sistemas = ?
        `;

        conn.query(read, [id_S], (err, sistemas) => {
            if (err) {
                res.json(err);
            }

            if (sistemas.length > 0) {
                res.render('software/editar-software', {
                    sistema: sistemas[0]
                });
            } else {
                res.status(404).send("Sistema no encontrado");
            }
        });
    });
};

function actualizarSoftware(req, res) {
    const id_S = req.params.id_S;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.json(err);
        }

        conn.query('UPDATE sistemas SET ? WHERE ID_Sistemas = ?', [data, id_S], (err, rows) => {
            if (err) {
                console.error('Error al actualizar sistema', err);
                return res.status(500).json({ message: 'Error al actualizar sistema', error: err.message });
            } else {
                res.redirect('/verSoftware');
            }
        });
    });
}

const eliminarS = (req, res) => {
    const id_S = req.body.id_S;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Sistemas WHERE ID_Sistemas = ?', [id_S], (err, rows) => {
            res.redirect('/verSoftware');
        });
    });
};

module.exports = {
    verSoftware: verSoftware,
    buscarS: buscarS,
    crearS: crearS,
    printSoftware: printSoftware,
    actualizarSoftware: actualizarSoftware,
    editarS: editarS,
    eliminarS: eliminarS
};
