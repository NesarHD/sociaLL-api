const express = require('express')

// use process.env variables to keep private variables,
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ localhost
var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'socio'
  }
});

// Controllers -  db queries
const main = require('./controllers/main')

// App
const app = express()

// App Middleware
const whitelist = ['http://localhost:3001']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth
app.get('/', (req, res) => res.send('welcome to Socio'))
app.get('/api/users', (req, res) => main.getUsers(req, res, db))
app.get('/api/users/:id', (req, res) => main.getUsersWithoutUser(req, res, db))
app.get('/api/user/:id', (req, res) => main.getUserData(req, res, db))
app.post('/api/friend-request/:id', (req, res) => main.friendRequest(req, res, db))
app.post('/api/accept-friend/:id', (req, res) => main.friendAccept(req, res, db))
app.post('/api/user', (req, res) => main.createUser(req, res, db))
app.put('/api/user', (req, res) => main.updateUser(req, res, db))
app.delete('/api/user', (req, res) => main.deleteUser(req, res, db))

// App Server Connection
app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})