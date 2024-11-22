const bcrypt = require('bcrypt');

function index(req, res) {
  if(req.session.loggedin != true){

    res.render('login/index');
  }else{
    res.redirect('/');
  }
}

function auth(req, res) {
  const data = req.body;
  const email = data.Correo_U;

  req.getConnection((err, conn) => {
      conn.query('SELECT * FROM usuario WHERE `Correo_U` = ?', [email], (err, rows) => {
          if (err) {
              console.error('Error al buscar el correo:', err);
              return res.status(500).send('Error al buscar el correo');
          }

          if (rows.length > 0) {
              const userdata = rows[0];
              // Verificar si el rol es "usuario" (asumiendo que el rol de usuario tiene un ID específico, por ejemplo, 2)
              if (userdata.Fk_Rol === 2) { 
                  return res.render('login/index', { error: 'No tienes autorización para acceder' });
              }

              bcrypt.compare(data.password, userdata.password, (err, isMatch) => {
                  if (!isMatch) {
                      return res.render('login/index', { error: 'Contraseña incorrecta' });
                  } else {
                      req.session.loggedin = true;
                      req.session.name = userdata.Nombre_U;
                      req.session.role = userdata.Fk_Rol;

                      res.redirect('/');
                  }
              });

          } else {
              res.render('login/index', { error: 'ERROR: Este usuario no Existe' });
          }
      });
  });
}

  function register(req, res) {
    if(req.session.loggedin != true){

      res.render('login/registro');
    }else{
      res.redirect('/');
    }
  }

function storeUser(req, res) {
  const data = req.body;
  const email = data.Correo_U;

  req.getConnection((err, conn) => {
      if (err) {
          return res.status(500).send('Error al obtener la conexión');
      }

      conn.query('SELECT * FROM usuario WHERE `Correo_U` = ?', [email], (err, rows) => {
          if (err) {
              console.error('Error al buscar el correo:', err);
              return res.status(500).send('Error al buscar el correo');
          }

          if (rows.length > 0) {
              // El correo ya está registrado
              return res.render('login/registro', { error: 'ERROR: Ya existe este Usuario' });
          }
          else{
            
          // Encriptacion de la contraseña
            bcrypt.hash(data.password, 12)
            .then(hash => {
                data.Fk_Rol = 2; // Valor predeterminado del rol
                data.password = hash; // Reemplazar la contraseña con el hash

                req.getConnection((err, conn) => {
                    if (err) {
                        console.error('Error al obtener conexión para insertar usuario:', err);
                        return res.status(500).send('Error al registrarse');
                    }
                    conn.query('INSERT INTO usuario SET ?', data, (err, result) => {
                        if (err) {
                            console.error('Error al insertar el usuario:', err);
                            return res.status(500).send('Error al registrar el usuario');
                        }
                        res.redirect('/login');
                    });
                });
            })
            .catch(err => {
                console.error('Error al encriptar la contraseña:', err);
                res.status(500).send('Error al registrar el usuario');
            });
          }
          
      });
  });
}

  
  function logout(req, res) {
    if (req.session.loggedin == true) {
      req.session.destroy();
    }
    res.redirect('/login');
  }
  
  
  module.exports = {
    index: index,
    register: register,
    auth: auth,
    logout: logout,
    storeUser,
  }