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

          if(rows.length > 0) {
            const userdata = rows[0]; 
            bcrypt.compare(data.password, userdata.password, (err, isMatch) => {

              if(!isMatch){
                res.render('login/index', { error: 'Contraseña incorrecta '});
              }else{
                req.session.loggedin = true;
                req.session.name = userdata.Nombre_U;
                //Clasificacion de Vistas por Rol
                if(userdata.Fk_Rol == 3)
                {
                  res.redirect('/');
                }else if(userdata.Fk_Rol == 2)
                  {
                    res.redirect('/registro');
                  }
              }
            });

          }else{
            res.render('login/index', { error: 'ERROR: Este usuario no Existe'});
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

  function storeUser(req, res){
    const data = req.body;
    const email = data.Correo_U;

     req.getConnection((err, conn) => {
         conn.query('SELECT * FROM usuario WHERE `Correo_U` = ?', [email], (err, rows) => {
          if (err) {
            console.error('Error al buscar el correo:', err);
            return res.status(500).send('Error al buscar el correo');
            }

           if(rows.length > 0) {
            res.render('login/registro', { error: 'ERROR: Ya existe este Usuario'});
            //  return res.status(400).send('El correo ya está registrado');
           } else {   
            
            bcrypt.hash(data.password, 12).then(hash => {
              data.Fk_Rol = 3;
              data.password = hash;
              req.getConnection((err, conn) =>{
                  if (err) {
                      console.error('Error al crear cliente:', err);
                      return res.status(500).send('Error al registrarse');
                  }else{
                      conn.query('INSERT INTO usuario SET ?', [data], (err, rows) =>{
                          res.redirect('/login');
                      });
                  }
              });
          }).catch(err => {
              console.error('Error al encriptar contraseña:', err);
              res.status(500).send('Error en el registro');
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