const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const db = require('./data/db-config')

const { restricted } = require('./auth/auth-middleware');
const authRouter = require('./auth/auth-router');
const plantRouter = require('./plants/plants-router');


const server = express()
server.use(express.json())
server.use(helmet())
server.use(cors())

server.use('/api/auth', authRouter);
server.use('/api/plants', restricted, plantRouter); 

server.get('/', (req, res) => {
  res.send('<h1>you rang?...</h1>')
})

server.use((err, req, res, next) => { 
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});



module.exports = server;
