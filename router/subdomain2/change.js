'use strict';

const User = require( '../../models/user.js' );
const utils = require( '../../lib/util/utils.js' );
const validator = require( '../../lib/util/validator.js' );

function get( req, res, next ) {
    const { hash } = req.params;

    function redirectToReset() {
        res.redirect( '/reset' );
    }

    Promise.resolve()
        .then( () => Promise.all( [
            Promise.resolve( validator.isValidHash( hash ) )
        ]))
        .then( results => {
            if( !( results[0] ) ) return redirectToReset();
            return User.findOne().where({ resetPasswordHash: hash }).select({ username: 1 }).lean()
                .then( user => {
                    if( !user ) return redirectToReset();
                    res.render( 'change', {
                        hash,
                        invalid: false,
                        username: user.username
                    });
                });
        })
        .catch( err => next( err ) );
}

function post( req, res, next ) {
    const { hash } = req.params;
    const { password, password_confirmation } = req.body;

    function renderInvalidChange( username ) {
        res.render( 'change', {
            hash,
            username,
            invalid: true
        });
    }

    Promise.resolve()
        .then( () => Promise.all( [
            Promise.resolve( validator.isValidHash( hash ) )
        ]))
        .then( valid => {
            if( !valid ) throw new Error( 'Invalid hash' );
            return User.findOne().where({ resetPasswordHash: hash }).select({ username: 1, password: 1, resetPasswordHash: 1, verifyEmailHash: 1, validated: 1 })
                .then( user => {
                    if( !user ) throw new Error( 'Invalid user' );
                    return Promise.resolve()
                        .then( () => Promise.all( [
                            Promise.resolve( validator.isValidPassword( password ) ),
                            Promise.resolve( validator.isValidPassword( password_confirmation ) )
                        ]))
                        .then( results => {
                            if( !( results[0] && results[1] ) ) return renderInvalidChange( user.username );
                            if( password !== password_confirmation ) return renderInvalidChange( user.username );
                            user.validated = true;
                            user.verifyEmailHash = null;
                            user.resetPasswordHash = null;
                            user.password = utils.saltHash( password );
                            return user.save()
                                .then( () => res.redirect( '/signin' ) );
                        });
                });
        })
        .catch( err => next( err ) );
}

module.exports = {
    get,
    post
};