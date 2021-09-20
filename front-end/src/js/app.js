try {
	window.$ = window.jQuery = require('jquery');
	// window.matchHeight = require('jquery-match-height');
	require('bootstrap');

} catch (e) {}

require('./main');
