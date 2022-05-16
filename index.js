'use strict';

require( 'dotenv' ).config();

const path = require( 'path' );
const http = require( 'http' );
const morgan = require( 'morgan' );
const router = require( './router' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();

app.set( 'ip', process.env.IP || '0.0.0.0' );
app.set( 'port', process.env.PORT || 8080 );
app.set( 'mongodb_url', process.env.MONGODB_URL || 'mongodb://localhost/base' );

mongoose.connect( app.get( 'mongodb_url' ), {
    autoIndex: true,
    useNewUrlParser: true
});

app.set( 'view engine', 'ejs' );
app.set( 'views', path.join( __dirname, 'views' ) );

app.use( morgan( ':method :req[host] :url :status :response-time ms - :res[content-length]' ) );

app.use( '/', router );

const server = http.createServer( app );

server.listen( app.get( 'port' ), app.get( 'ip' ), () => {
    const { port, address } = server.address();
    console.log( `Server listening ${address} on port ${port}` );
});