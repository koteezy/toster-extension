const mix = require( 'laravel-mix' );

mix.setPublicPath( './' );

mix.js( 'src/app.js', 'build/bundle.js' );