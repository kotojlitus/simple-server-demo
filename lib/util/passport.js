'use strict';

const passport = require( 'passport' );

const User = require( '../../models/user.js' );

passport.serializeUser( ( user, done ) => {
    // console.log('serializeUser user: ',user)
    done( null, user._id );
});

passport.deserializeUser( ( id, done ) => {
    // console.log('deserializeUser id: ',id)
    User.findById( id ).lean()
        .then( user => { done( null, user ); })
        .catch( done );
});

function init( app ) {
    app.use( passport.initialize() );
    app.use( passport.session() );
}

module.exports = {
    init
};