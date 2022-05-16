'use strict';

const util = require( 'util' );

const User = require( '../../models/user.js' );
const utils = require( '../../lib/util/utils.js' );
const validator = require( '../../lib/util/validator.js' );

function get( req, res ) {
    res.render( 'signin', {
        invalid: false,
        email: ''
    });
}

function post( req, res, next ) {
    const { email, password } = req.body;
    const login = util.promisify( req.logIn.bind( req ) );

    function renderInvalidSignin() {
        res.render( 'signin', {
            invalid: true,
            email
        });
    }

    Promise.resolve()
        .then( () => Promise.all( [
            Promise.resolve( validator.isValidEmail( email ) ),
            Promise.resolve( validator.isValidPassword( password ) )
        ]))
        .then( results => {
            if( !( results[0] && results[1] ) ) return renderInvalidSignin();
            return User.findOne().where({ email }).select({ email: 1, password: 1 }).lean()
                .then( user => {
                    if( !user ) return renderInvalidSignin();
                    const hash = utils.getHash( password, user.password.salt );
                    if( hash !== user.password.hash ) return renderInvalidSignin();
                    return Promise.resolve( user )
                        .then( user => login( user ) )
                        .then( () => res.redirect( '/' ) )
                });
        })
        .catch( err => next( err ) );
}

module.exports = {
    get,
    post
};