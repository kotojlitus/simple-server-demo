'use strict';

const path = require( 'path' );
const express = require( 'express' );
const subdomain = require( 'express-subdomain' );

const subdomain2 = require( './subdomain2' );
const subdomain1 = require( './subdomain1.js' );

const router = express.Router();

router.use( subdomain( 'subdomain1', subdomain1 ) );
router.use( subdomain( 'subdomain2', subdomain2 ) );

router.use( express.static( path.join( __dirname, '..', 'public' ) ) );

module.exports = router;