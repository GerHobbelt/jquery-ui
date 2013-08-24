(function(window) {

// OPTIONAL global var: jquery_script_basedir

var parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0,
	current,
	version,
	url,
	path;

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "jquery" ) {
		version = current[ 1 ];
		break;
	}
}

if ( version === "git" ) {
	url = "http://code.jquery.com/jquery-git.js";
} else {
	path = (window.jquery_script_basedir || "../..");
	url = path + "/jquery-" + ( version || "bleeding-edge" ) + ".js";
}

document.write( "<script src='" + url + "'></script>" );

window.onJqueryLoaded = function() {
	var queue = [];
	var h;
	var check_if_loaded = function() {
		if (h) clearTimeout(h);
		h = null;

		if (window.jQuery) {
			var f;

			// written so that f() can invoke window.onJqueryLoaded(f) itself without damaging the process:
			while (queue.length > 0) {
				f = queue.shift();
				f();
			}
			return true;
		} else {
			// jQuery has not loaded yet: try again in a little while (POLLING):
			h = setTimeout(check_if_loaded, 100);
			return false;
		}
	};

	return function(f) {
		if (f) queue.push(f);

		return check_if_loaded();
	}
};

window.onJqueryLoaded = window.onJqueryLoaded();

}(this) );
