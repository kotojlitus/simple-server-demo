'use strict';

const util = require( 'util' );

const User = require( '../../models/user.js' );
const utils = require( '../../lib/util/utils.js' );
const validator = require( '../../lib/util/validator.js' );
const mailinator = require( '../../lib/util/mailinator.js' );

function get( req, res ) {
    res.render( 'signup', {
        invalid: false,
        email: '',
        username: ''
    });
}

function post( req, res, next ) {
    const { email, password, username } = req.body;
    const login = util.promisify( req.logIn.bind( req ) );

    function renderInvalidSignup() {
        res.render( 'signup', {
            email,
            username,
            invalid: true
        });
    }

    Promise.resolve()
        .then( () => Promise.all( [
            Promise.resolve( validator.isValidEmail( email ) ),
            Promise.resolve( validator.isValidPassword( password ) ),
            Promise.resolve( validator.isValidUsername( username ) )
        ]))
        .then( results => {
            if( !( results[0] && results[1] && results[2] ) ) return renderInvalidSignup();
            return User.findOne().where({ email }).select({ email: 1 }).lean()
                .then( user => {
                    if( user ) return renderInvalidSignup();
                    const verifyEmailHash = utils.saltHash( 'need verify email' ).hash;
                    return User.create( {
                        email,
                        username,
                        verifyEmailHash,
                        password: utils.saltHash( password )
                    })
                        .then( user => login( user ) )
                        .then( () => {
                            mailinator.sendSignupMail( email, verifyEmailHash );
                            res.redirect( '/' );
                        });
                });
        })
        .catch( err => next( err ) );
}

module.exports = {
    get,
    post
};