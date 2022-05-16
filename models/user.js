'use strict';

const mongoose = require( 'mongoose' );

const User = new mongoose.Schema( {
    email: { type: String, index: true, unique: true },
    password: {
        hash: String,
        salt: String
    },
    username: String,
    validated: { type: Boolean, default: false },
    verifyEmailHash: { type: String, default: null },
    resetPasswordHash: { type: String, default: null }
});

User.index( { verifyEmailHash: 1 }, { unique: true, partialFilterExpression: { verifyEmailHash: { $type: "string" } } } );
User.index( { resetPasswordHash: 1 }, { unique: true, partialFilterExpression: { resetPasswordHash: { $type: "string" } } } );

module.exports = mongoose.model( 'User', User );