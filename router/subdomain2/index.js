'use strict';

const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const session = require( '../../lib/util/session.js' );
const passport = require( '../../lib/util/passport.js' );

const root = require( './root.js' );
const reset = require( './reset.js' );
const change = require( './change.js' );
const signin = require( './signin.js' );
const signup = require( './signup.js' );
const verify = require( './verify.js' );

const router = express.Router();

router.use( bodyParser.urlencoded( { extended: false } ) );

session.init( router );
passport.init( router );

router.get( '/signin', isUnauthenticated, signin.get );
router.post( '/signin', isUnauthenticated, signin.post );

router.get( '/signup', isUnauthenticated, signup.get );
router.post( '/signup', isUnauthenticated, signup.post );

router.get( '/verify/resend', verify.resend );
router.get( '/verify/:hash', verify.get );

router.get( '/reset', isUnauthenticated, reset.get );
router.post( '/reset', isUnauthenticated, reset.post );

router.get( '/change/:hash', isUnauthenticated, change.get );
router.post( '/change/:hash', isUnauthenticated, change.post );

router.get( '/', isAuthenticated, root.get );

function isAuthenticated( req, res, next ) {
    if( req.isUnauthenticated() ) return res.redirect( '/signin' );
    if( !req.user.validated ) return res.render( 'resend', { email: req.user.email } );
    next();
}

function isUnauthenticated( req, res, next ) {
    if( req.isUnauthenticated() ) return next();
    res.redirect( '/' );
}

module.exports = router;