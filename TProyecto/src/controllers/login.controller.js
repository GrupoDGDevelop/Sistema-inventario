const bcrypt = require('bcrypt');

// Función para mostrar la vista de inicio de sesión si el usuario no ha iniciado sesión
function index(req, res) {
  if(req.session.loggedin != true){
    res.render('login/index');  // Renderiza la vista de inicio de sesión
  }else{
    res.redirect('/');  // Redirige al usuario si ya está logueado
  }
}

// Función para autenticar al usuario
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
                      req.session.loggedin = true;  // Marca al usuario como logueado
                      req.session.name = userdata.Nombre_U;
                      req.session.role = userdata.Fk_Rol;

                      res.redirect('/');  // Redirige al usuario a la página principal
                  }
              });

          } else {
              res.render('login/index', { error: 'ERROR: Este usuario no Existe' });
          }
      });
  });
}

// Función para mostrar la vista de registro si el usuario no está logueado
function register(req, res) {
  if(req.session.loggedin != true){
    res.render('login/registro');  // Renderiza la vista de registro
  }else{
    res.redirect('/');  // Redirige al usuario si ya está logueado
  }
}

// Función para almacenar un nuevo usuario en la base de datos
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
            
          // Encriptación de la contraseña antes de guardarla
            bcrypt.hash(data.password, 12)
            .then(hash => {
                data.Fk_Rol = 2; // Asigna un rol por defecto al usuario
                data.password = hash; // Reemplaza la contraseña con el hash

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
                        res.redirect('/login');  // Redirige al inicio de sesión después del registro exitoso
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

// Función para cerrar sesión y redirigir al login
function logout(req, res) {
  if (req.session.loggedin == true) {
    req.session.destroy();  // Destruye la sesión activa
  }
  res.redirect('/login');  // Redirige al inicio de sesión
}

// Exportación de las funciones para su uso en las rutas
module.exports = {
  index: index,
  register: register,
  auth: auth,
  logout: logout,
  storeUser,
}
