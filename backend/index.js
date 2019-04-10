const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
 
const app = express()

app.use(cors())

const authenticateController = require('./controllers/authenticate-controller')
const registerController = require('./controllers/register-controller')

app.use(bodyParser.urlencoded({  extended: true }))
app.use(bodyParser.json())

// route to handle login and registration

app.post('/api/register', registerController.register)
app.post('/api/authenticate', authenticateController.authenticate)

app.listen(8012, (req, res) => {
    console.log('le port est ' + 8012);
})
