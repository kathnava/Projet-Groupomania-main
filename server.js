var express = require('express');
const cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var apiRouter = require('./apiRouter').router;

// Instantiate server
var server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send('<h1>Bonjour server</h1>') 
});

server.use('/api/', apiRouter);

server.listen(3500, function() {
    console.log('Server en écoute :)');
})