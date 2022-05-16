'use strict';

function get( req, res ) {
    res.send( 'root' );
}

function root( req, res ) {
    res.redirect( '/' );
}

module.exports = {
    get,
    root
};