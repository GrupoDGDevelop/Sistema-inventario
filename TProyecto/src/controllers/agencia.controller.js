const verAgencia = (req, res) => {
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Agencia;`;
        conn.query(read, (err, agencias) => {
            if (err) {
                res.json(err);
            }
            res.render('agencia/agencia', { agencias });
        });
    });
};

const buscarAgencia = (req, res) => {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `SELECT * FROM Agencia WHERE Nom_Agencia LIKE ?;`;
        conn.query(query, [`%${searchTerm}%`], (err, agencias) => {
            if (err) {
                res.json(err);
            }
            res.render('agencia/agencia', { agencias });
        });
    });
};

const crearAgencia = (req, res) => {
    res.render('agencia/crear-agencia');
};


const printAgencia = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Agencia SET ?', [data], (err, rows) => {
            if (err) {
                console.error('Error al insertar en Agencia', err);
                return res.status(500).send('Error al crear Agencia');
            } else {
                res.redirect('/verAgencia');
            }
        });
    });
};

const editarAgencia = (req, res) => {
    const id_Area = req.params.id_Area;
    req.getConnection((err, conn) => {
        const read = `SELECT * FROM Agencia WHERE Id_Area = ?;`;
        conn.query(read, [id_Area], (err, agencias) => {
            if (err) {
                res.json(err);
            }
            if (agencias.length > 0) {
                res.render('agencia/editar-agencia', { agencia: agencias[0] });
            } else {
                res.status(404).send("Agencia no encontrada");
            }
        });
    });
};

function actualizarAgencia(req, res) {
    const id_Area = req.params.id_Area;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.json(err);
        }
        conn.query('UPDATE Agencia SET ? WHERE Id_Area = ?', [data, id_Area], (err, rows) => {
            if (err) {
                console.error('Error al actualizar agencia', err);
                return res.status(500).json({ message: 'Error al actualizar agencia', error: err.message });
            } else {
                res.redirect('/verAgencia');
            }
        });
    });
}

const eliminarAgencia = (req, res) => {
    const id_Area = req.body.id_Area;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM Agencia WHERE Id_Area = ?', [id_Area], (err, rows) => {
            res.redirect('/verAgencia');
        });
    });
};

module.exports = {
    verAgencia: verAgencia,
    buscarAgencia: buscarAgencia,
    crearAgencia: crearAgencia,
    printAgencia: printAgencia,
    actualizarAgencia: actualizarAgencia,
    editarAgencia: editarAgencia,
    eliminarAgencia: eliminarAgencia
};
