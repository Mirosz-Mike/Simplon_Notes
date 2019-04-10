const connection = require('../config')
const bcrypt = require('bcrypt')
const { emaildUser, passwordUser } = require('../client/src/const')


module.exports.register = async function(req, res) {
    const today = new Date()
    let users = {
			"name": req.body.name,
			"email": req.body.email,
			"password": req.body.password,
			"create_at": today,
			"updated_at": today
		}

		// hasher les mots de passe
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(users.password, salt)

		if (users.name === '') {
			console.log(res);
			res.status(400).send('Veuillez indiquez votre prénom')
		} else {
			if (emaildUser.test(users.email)) {
					connection.query('SELECT email FROM users WHERE email = ?', users.email, function (error, results, fields) {
							if (error) {
								res.status(500).send(error.message)
							} 
							if (results.length > 0) {
								res.status(403).send({ message : 'votre email existe deja' })
							}
							else {
								if (passwordUser.test(users.password)) {
										users = {...users, password: hash}
										connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
											if (error) {
													res.status(500).send('probleme avec la query ' + error.message)
											} 
											else {
													res.status(200).send({
															message: 'user enregister avec succès ',
															user :  users
													})
											}
										});
								} else {
									console.log(res);
									res.status(400).send({
										password : `Votre mot de passe doit contenir au moins
											- 1 caractère alphabétique minuscule.
											- 1 caractère alphabétique majuscule.
											- 1 caractère numérique.
											- 1 caractère spécial.
											- Votre mot de passe doit comporter 8 au minimum caractères`
									})
								}
							}
						});
			} else {
					res.status(400).send('mail non valide')
			}
		}
}
