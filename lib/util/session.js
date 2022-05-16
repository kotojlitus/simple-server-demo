'use strict';

const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' )( session );

function init( app ) {
    app.use( session( {
        name: 'name',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore( {
            mongooseConnection: mongoose.connection
        })
    }));
}

module.exports = {
    init
};