const connection = require ('../config')
const bcrypt = require('bcrypt')

module.exports.authenticate = function(req, res) {
  const email = req.body.email
  const password = req.body.password

  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
        res.status(500).send('probleme avec la query')
      }else{
        if(results.length > 0){
            bcrypt.compare(password, results[0].password, function(err, ress) {
                if(!ress){
                  res.status(400).send('Email ou password non valide')
                }else{     
                  res.status(200).send('user connecté avec succès')         
                }
            });         
        }
        else{
          res.status(400).send("Votre email n'existe pas")
        }
      }
    });
}