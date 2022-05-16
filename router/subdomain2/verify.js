'use strict';

const User = require( '../../models/user.js' );
const mailinator = require( '../../lib/util/mailinator.js' );

function get( req, res ) {
    const { hash } = req.params;
    // check hash
    User.updateOne({ verifyEmailHash: hash, validated: false }, { $set: { verifyEmailHash: null, validated: true } }).exec();
    res.redirect( '/' );
}

function resend( req, res ) {
    if( req.isAuthenticated() && !req.user.validated ) mailinator.sendSignupMail( req.user.email, req.user.verifyEmailHash );
    res.redirect( '/' );
}

module.exports = {
    get,
    resend
};