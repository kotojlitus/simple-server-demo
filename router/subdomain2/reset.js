'use strict';

const User = require( '../../models/user.js' );
const utils = require( '../../lib/util/utils.js' );
const validator = require( '../../lib/util/validator.js' );
const mailinator = require( '../../lib/util/mailinator.js' );

function get( req, res ) {
    res.render( 'reset', { invalid: false } );
}

function post( req, res, next ) {
    const { email } = req.body;

    function renderInvalidReset() {
        res.render( 'reset', { invalid: true } );
    }

    Promise.resolve()
        .then( () => Promise.all( [
            Promise.resolve( validator.isValidEmail( email ) )
        ]))
        .then( results => {
            if( !( results[0] ) ) return renderInvalidReset();
            return User.findOne().where({ email }).select({ email: 1, resetPasswordHash: 1 })
                .then( user => {
                    if( !user ) return renderInvalidReset();
                    user.resetPasswordHash = user.resetPasswordHash || utils.saltHash( 'reset password' ).hash;
                    return user.save()
                        .then( () => {
                            mailinator.sendResetPassMail( email, user.resetPasswordHash );
                            res.redirect( '/signin' );
                        });
                });
        })
        .catch( err => next( err ) );
}

module.exports = {
    get,
    post
};