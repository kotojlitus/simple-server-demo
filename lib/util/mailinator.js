'use strict';

const nodemailer = require( 'nodemailer' );

const transporter = nodemailer.createTransport( {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'nn4cbr4dgujiw3fk@ethereal.email',
        pass: 'aU8HT38KDPBVktndHn'
    }
}, {
    from: '"Mydomain.com" <support@mydomain.com>'
});

function traceDevMessage( info ) {
    if( process.env.NODE_ENV === 'dev' ) {
        console.log( nodemailer.getTestMessageUrl( info ) );
    }
    return info;
}

function traceSilentError( err ) {
    console.log( err );
    return null;
}

function sendMail( to, subject, html ) {
    return transporter.sendMail({ to, html, subject })
        .then( traceDevMessage )
        .catch( traceSilentError );
}

function sendSignupMail( email, hash ) {
    const subject = 'Welcome to us';
    const link = `http://subdomain2.mydomain.dev/verify/${hash}`;
    const text = `<a href=\"${link}" target=\"_blank">${link}</a>`;
    return sendMail( email, subject, text );
}

function sendResetPassMail( email, hash ) {
    const subject = 'Reset your password';
    const link = `http://subdomain2.mydomain.dev/change/${hash}`;
    const text = `<a href=\"${link}" target=\"_blank">${link}</a>`;
    return sendMail( email, subject, text );
}

module.exports = {
    sendSignupMail,
    sendResetPassMail
};