'use strict';

const crypto = require( 'crypto' );

function getRandomString( length ) {
    return crypto.randomBytes( length ).toString( 'hex' ).slice( 0, length );
}

function getHash( value, salt ) {
    return crypto.createHmac( 'sha256', salt ).update( value ).digest( 'hex' );

}

function saltHash( password ) {
    const salt = getRandomString( 16 );
    const hash = getHash( password, salt );
    return { salt, hash };
}

module.exports = {
    saltHash,
    getHash
};