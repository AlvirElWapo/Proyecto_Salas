const express = require('express');
const path = require('path');
const db = require('../db/database_connection');
const argon2 = require('argon2');

const app = express()

app.post('/login', (req, res) => {
  const username_or_email = req.body.username;
  const password = req.body.password;

  get_pwd_hash(username_or_email, (err, pwd_hash_res) => {
    if (err) {
      // If USER NOT FOUND in USUARIO, try validating as Moderador
      validateModerador(username_or_email, password, (mod_err, modUser) => {
        if (mod_err) {
          console.log(mod_err);
          return res.status(505).send("USER NOT FOUND");
        } else {
          // User validated as Moderador
          req.session.isLoggedIn = true;
          req.session.username = modUser.nombre_usuario;
          req.session.full_name = modUser.nombre_completo;
          req.session.user_type = modUser.tipo_usuario;
          req.session.email = modUser.email;
          req.session.id_mod = modUser.id_mod;

          // Send user data back to the client
          res.json({
            success: true,
            user: {
              username: req.session.username,
              full_name: req.session.full_name,
              user_type: req.session.user_type,
              email: req.session.email,
              id: req.session.id_mod
            }
          });
        }
      });
    } else {
      // User found in USUARIO, verify password
      verifyPassword(pwd_hash_res, password).then((password_Matches) => {
        if (password_Matches) {
          console.log("LOGIN EXITOSO DEL USUARIO: ", username_or_email);
          req.session.isLoggedIn = true;
          get_everything(username_or_email, (err, everything) => {
            req.session.username = everything[0].nombre_usuario;
            req.session.full_name = everything[0].nombre_completo;
            req.session.user_type = everything[0].tipo_usuario;
            req.session.email = everything[0].email;

            // Send user data back to the client
            res.json({
              success: true,
              user: {
                username: req.session.username,
                full_name: req.session.full_name,
                user_type: req.session.user_type,
                email: req.session.email
              }
            });
          });
        } else {
          console.log('INTENTO DE SESIÓN FALLIDO');
          res.status(505).send("Login Failed");
        }
      }).catch((error) => {
        console.error('Password verification failed:', error);
        res.status(505).send("PASSWORD VERIFICATION FAILED");
      });
    }
  });
});

app.get('/register', (req, res) => {res.render('register');});

app.post('/register', (req, res) => 
{
    const { username, email, full_name, password } = req.body;
    hashPassword(password).then((contr_encriptada)=>
    {
    console.log( "HASH CREADO DE CONTRASEÑA: " + contr_encriptada)
    db.query(
      'INSERT INTO USUARIO (tipo_usuario, password_hash, email, nombre_completo, nombre_usuario) VALUES(?, ?, ?, ?,?) ;',
      [ 'moderador' ,contr_encriptada, email, full_name, username],
      (err, sql_res) =>
      {
        if (err) {console.error(err);return res.status(500).send('Internal Server Error at Registration');}
        if (sql_res.affectedRows === 1)
        {
          console.log("REGISTRATION OF USER " + username); 
          res.sendFile(path.join(__dirname,'../public/pagina_login/pagina_login.html'))
        } 
        else {return res.status(401).send('REGISTRATION FAILED');}
      });
    }).catch((error) =>
    {
    // Handle the error here (e.g., log, return an error response)
    console.error('ERROR AL HASHEAR CONTRASEÑA:', error);
    });
  });


async function hashPassword(password)
{
  try 
  {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) 
  {
    console.error('Error hashing password:', error);
    throw error;
  }

}


async function verifyPassword(hashedPassword, providedPassword) 
{
  try 
  {
    const passwordMatches = await argon2.verify(hashedPassword, providedPassword);
    return passwordMatches;
  } catch (error) 
  {
    console.error('Error verifying password:', error);
    throw error;
  }
}

function get_pwd_hash(username_or_email, callback) {
  db.query('SELECT PASSWORD_HASH FROM USUARIO WHERE NOMBRE_USUARIO = ? OR EMAIL = ?', 
  [username_or_email, username_or_email], (err, sql_res) => {
    if (err) {
      console.error(err);
      return callback("sql_error");
    }
    if (sql_res.length === 1) {
      const passwordHash = sql_res[0].PASSWORD_HASH;
      return callback(null, passwordHash);
    } else {
      return callback("USER NOT FOUND");
    }
  });
}



function validateModerador(username_or_email, password, callback) {
  // Modify the SQL query to retrieve the required fields (full name and email)
  db.query(
    'SELECT ID_Mod, Moderador, Correo FROM MODERADORES WHERE Moderador = ? OR Correo = ?',
    [username_or_email, username_or_email],
    (err, sql_res) => {
      if (err) {
        console.error(err);
        return callback("sql_error");
      }
      if (sql_res.length === 1 && sql_res[0].ID_Mod === password) {
        // Create a modUser object with the retrieved fields
        const modUser = {
          nombre_usuario: sql_res[0].Moderador, // Use the Moderador field as username
          nombre_completo: sql_res[0].Moderador, // Use the Moderador field as full name
          tipo_usuario: 'moderador',
          email: sql_res[0].Correo, // Use the Correo field as email
          id_mod: sql_res[0].ID_Mod
        };
        return callback(null, modUser);
      } else {
        return callback("USER NOT FOUND OR PASSWORD INVALID");
      }
    }
  );
}

function get_everything(username_or_email, callback) {
  db.query('SELECT * FROM USUARIO WHERE NOMBRE_USUARIO = ? OR EMAIL = ?', 
  [username_or_email, username_or_email], (err, sql_res) => {
    if (err) {
      console.error(err);
      return callback("sql_error");
    }
    if (sql_res.length === 1) {
      // User found in USUARIO table
      return callback(null, sql_res);
    } else {
      // Check in MODERADORES table if not found in USUARIO
      db.query('SELECT * FROM MODERADORES WHERE Moderador = ? OR Correo = ?', 
      [username_or_email, username_or_email], (err, mod_res) => {
        if (err) {
          console.error(err);
          return callback("sql_error");
        }
        if (mod_res.length === 1) {
          const modUser = {
            nombre_usuario: mod_res[0].Moderador,
            nombre_completo: mod_res[0].Moderador,
            tipo_usuario: 'moderador',
            email: mod_res[0].Correo,
            id: mod_res[0].ID_Mod
          };
          return callback(null, [modUser]);
        } else {

          return callback("USER NOT FOUND");
        }
      });
    }
  });
}

async function verifyPassword(hashedPassword, providedPassword) {
  try {
    const passwordMatches = await argon2.verify(hashedPassword, providedPassword);
    return passwordMatches;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

function get_pwd_hash(username_or_email, callback)
{
  db.query(
    'SELECT PASSWORD_HASH FROM USUARIO WHERE NOMBRE_USUARIO = ? OR EMAIL = ?', 
    [username_or_email,username_or_email],
    (err, sql_res) =>
    {
      if (err) {console.error(err);callback("sql_error")}
      if (sql_res.length === 1)
      {
        const passwordHash = sql_res[0].PASSWORD_HASH;
        callback(null,passwordHash);
      } 
      else
      {
        callback("USER NOT FOUND");
      }
    })
}

function get_everything(username_or_email, callback) {
  db.query('SELECT * FROM USUARIO WHERE NOMBRE_USUARIO = ? OR EMAIL = ?', 
  [username_or_email, username_or_email], (err, sql_res) => {
    if (err) {
      console.error(err);
      return callback("sql_error");
    }
    if (sql_res.length === 1) {
      return callback(null, sql_res);
    } else {
      return callback("USER NOT FOUND");
    }
  });
}




module.exports = app;
