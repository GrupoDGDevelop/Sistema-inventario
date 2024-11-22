const bcrypt = require('bcrypt');

function verUsuario(req, res) {
    req.getConnection((err, conn) => {
        const read = `
            SELECT u.*, r.Nom_Rol AS Rol
            FROM usuario u
            JOIN rol r ON u.Fk_Rol = r.ID_Rol
        `;
        conn.query(read, (err, usuarios) => {
            if (err) {
                res.json(err);
            }
            res.render('usuario/usuario', { usuarios });
        });
    });
}

function buscarU(req, res) {
    const searchTerm = req.body.searchTerm;

    req.getConnection((err, conn) => {
        const query = `
            SELECT u.*, r.Nom_Rol AS Rol
            FROM usuario u
            JOIN rol r ON u.Fk_Rol = r.ID_Rol
            WHERE u.Nombre_U LIKE ?
        `;
        conn.query(query, [`%${searchTerm}%`], (err, usuarios) => {
            if (err) {
                res.json(err);
            }
            res.render('usuario/usuario', { usuarios });
        });
    });
}

function editarU(req, res) {
    const id_U = req.params.id_U;
    req.getConnection((err, conn) => {
        const read = `
            SELECT * FROM usuario 
            WHERE ID_Usuario = ?
        `;

        conn.query(read, [id_U], (err, usuario) => {
            if (err) {
                res.json(err);
            }

            if (usuario.length > 0) {
                const rolesQuery = 'SELECT * FROM rol';

                conn.query(rolesQuery, (err, roles) => {
                    if (err) return res.json(err);

                    res.render('usuario/editar-usuario', {
                        usuario: usuario[0],
                        roles: roles,
                    });
                });
            } else {
                res.status(404).send("Usuario no encontrado");
            }
        });
    });
}

function actualizarU(req, res) {
    const id_U = req.params.id_U;
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión:", err);
            return res.json(err);
        }

        // Primero, obtenemos el usuario actual para comparar la contraseña
        conn.query('SELECT * FROM usuario WHERE ID_Usuario = ?', [id_U], (err, rows) => {
            if (err) {
                console.error("Error al obtener usuario:", err);
                return res.status(500).send('Error al obtener usuario');
            }

            const existingUser = rows[0];

            // Si la contraseña es diferente a la actual, encriptamos la nueva contraseña
            if (data.password && data.password !== existingUser.password) {
                bcrypt.hash(data.password, 12)
                    .then(hash => {
                        data.password = hash; // Asigna el hash en lugar de la contraseña en texto plano

                        // Actualiza el usuario con la contraseña encriptada
                        conn.query('UPDATE usuario SET ? WHERE ID_Usuario = ?', [data, id_U], (err, result) => {
                            if (err) {
                                console.error("Error al actualizar usuario:", err);
                                return res.status(500).send('Error al actualizar usuario');
                            }
                            res.redirect('/verUsuario');
                        });
                    })
                    .catch(err => {
                        console.error("Error al encriptar la contraseña:", err);
                        res.status(500).send('Error al encriptar la contraseña');
                    });
            } else {
                // Si la contraseña no ha cambiado, actualiza sin encriptar
                delete data.password; // Elimina el campo password de los datos para evitar cambios

                conn.query('UPDATE usuario SET ? WHERE ID_Usuario = ?', [data, id_U], (err, result) => {
                    if (err) {
                        console.error("Error al actualizar usuario:", err);
                        return res.status(500).send('Error al actualizar usuario');
                    }
                    res.redirect('/verUsuario');
                });
            }
        });
    });
}

function eliminarU(req, res) {
    const id_U = req.body.id_U;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM usuario WHERE ID_Usuario = ?', [id_U], (err, rows) => {
            if (err) {
                console.error("Error al eliminar el usuario:", err);
                return res.status(500).send("Error al eliminar usuario");
            }
            res.redirect('/verUsuario');
        });
    });
}

module.exports = {
    verUsuario: verUsuario,
    buscarU: buscarU,
    editarU: editarU,
    actualizarU: actualizarU,
    eliminarU: eliminarU,
};
