module.exports = function( grunt ) {

"use strict";

var amdclean = require('amdclean');

var
	// files
	coreFiles = [
		"core.js",
		"widget.js",
		"mouse.js",
		"draggable.js",
		"droppable.js",
		"resizable.js",
		"selectable.js",
		"sortable.js",
		"effect.js"
	],

	uiFiles = coreFiles.map(function( file ) {
		return "ui/" + file;
	}).concat( expandFiles( "ui/*.js" ).filter(function( file ) {
		return coreFiles.indexOf( file.substring( 3 ) ) === -1;
	}) ),

	allI18nFiles = expandFiles( "ui/i18n/*.js" ),

	cssFiles = [
		"core",
		"accordion",
		"autocomplete",
		"button",
		"datepicker",
		"dialog",
		"draggable",
		"menu",
		"menubar",
		"popup",
		"progressbar",
		"resizable",
		"selectable",
		"selectmenu",
		"sortable",
		"slider",
		"spinner",
		"tabs",
		"tooltip",
		"theme"
	].map(function( component ) {
		return "themes/base/" + component + ".css";
	}),

	// minified files
	minify = {
		options: {
			preserveComments: false
		},
		main: {
			options: {
				banner: createBanner( uiFiles )
			},
			files: {
				"dist/jquery-ui.min.js": "dist/jquery-ui.js"
			}
		},
		i18n: {
			options: {
				banner: createBanner( allI18nFiles )
			},
			files: {
				"dist/i18n/jquery-ui-i18n.min.js": "dist/i18n/jquery-ui-i18n.js"
			}
		}
	},

	compareFiles = {
		all: [
			"dist/jquery-ui.js",
			"dist/jquery-ui.min.js"
		]
	},
	component = grunt.option( "component" ) || "**";

function mapMinFile( file ) {
	return "dist/" + file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" );
}

function expandFiles( files ) {
	return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
		return values[ 0 ];
	});
}

uiFiles.concat( allI18nFiles ).forEach(function( file ) {
	minify[ file ] = {
		options: {
			banner: createBanner()
		},
		files: {}
	};
	minify[ file ].files[ mapMinFile( file ) ] = file;
});

uiFiles.forEach(function( file ) {
	// TODO this doesn't do anything until https://github.com/rwldrn/grunt-compare-size/issues/13
	compareFiles[ file ] = [ file, mapMinFile( file ) ];
});

// grunt plugins
require( "load-grunt-tasks" )( grunt );
// local testswarm and build tasks
grunt.loadTasks( "build/tasks" );

function stripDirectory( file ) {
	return file.replace( /.+\/(.+?)>?$/, "$1" );
}

function createBanner( files ) {
	// strip folders
	var fileNames = files && files.map( stripDirectory );
	return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= grunt.template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
		(files ? "* Includes: " + fileNames.join(", ") + "\n" : "") +
		"* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";
}

grunt.initConfig({
	pkg: grunt.file.readJSON( "package.json" ),
	files: {
		dist: "<%= pkg.name %>-<%= pkg.version %>"
	},
	compare_size: compareFiles,
	concat: {
		ui: {
			options: {
				banner: createBanner( uiFiles ),
				stripBanners: {
					block: true
				}
			},
			src: uiFiles,
			dest: "dist/jquery-ui.js"
		},
		i18n: {
			options: {
				banner: createBanner( allI18nFiles )
			},
			src: allI18nFiles,
			dest: "dist/i18n/jquery-ui-i18n.js"
		},
		css: {
			options: {
				banner: createBanner( cssFiles ),
				stripBanners: {
					block: true
				}
			},
			src: cssFiles,
			dest: "dist/jquery-ui.css"
		}
	},
	jscs: {
		// datepicker and sortable are getting rewritten, ignore until that's done
		ui: [ "ui/*.js", "!ui/datepicker.js", "!ui/sortable.js" ],
		// TODO enable this once we have a tool that can auto format files
		// tests: "tests/unit/**/*.js",
		grunt: [ "Gruntfile.js", "build/tasks/*.js" ]
	},
	uglify: minify,
	htmllint: {
		// ignore files that contain invalid html, used only for ajax content testing
		all: grunt.file.expand( [ "demos/**/*.html", "tests/**/*.html" ] ).filter(function( file ) {
			return !/(?:ajax\/content\d\.html|tabs\/data\/test\.html|tests\/unit\/core\/core.*\.html)/.test( file );
		})
	},
	qunit: {
		files: expandFiles( "tests/unit/" + component + "/*.html" ).filter(function( file ) {
			return !( /(all|index|test)\.html$/ ).test( file );
		}),
		options: {
			page: {
				viewportSize: { width: 700, height: 500 }
			}
		}
	},
	jshint: {
		options: {
			jshintrc: true
		},
		all: [
			"ui/*.js",
			"Gruntfile.js",
			"build/**/*.js",
			"tests/unit/**/*.js"
		]
	},
	csslint: {
		base_theme: {
			src: "themes/base/*.css",
			options: {
				csslintrc: ".csslintrc"
			}
		}
	},

	esformatter: {
		options: {
			preset: "jquery"
		},
		ui: "ui/*.js",
		tests: "tests/unit/**/*.js",
		build: {
			options: {
				skipHashbang: true
			},
			src: "build/**/*.js"
		},
		grunt: "Gruntfile.js"
	},

    amdclean: {
        lib: {
            options: {
                // Wrap any build bundle in a start and end text specified by wrap
                // This should only be used when using the onModuleBundleComplete RequireJS
                // Optimizer build hook
                // If it is used with the onBuildWrite RequireJS Optimizer build hook, each
                // module will get wrapped
                wrap: {
                    // This string is prepended to the file
                    start: '\n' +
                           '\n' +
                           '/**\n' +
                           ' * dat-gui JavaScript Controller Library\n' +
                           ' * http://code.google.com/p/dat-gui\n' +
                           ' *\n' +
                           ' * Copyright 2011 Data Arts Team, Google Creative Lab\n' +
                           ' *\n' +
                           ' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
                           ' * you may not use this file except in compliance with the License.\n' +
                           ' * You may obtain a copy of the License at\n' +
                           ' *\n' +
                           ' * http://www.apache.org/licenses/LICENSE-2.0\n' +
                           ' */\n' +
                           '\n' +
                           '(function (root, factory) {\n' +
                           '  if (typeof define === \'function\' && define.amd) {\n' +
                           '    // AMD. Register as an anonymous module.\n' +
                           '    define(factory);\n' +
                           '  } else {\n' +
                           '    // Browser globals\n' +
                           '    root.dat = factory();\n' +
                           '  }\n' +
                           '}(this, function () {\n' +
                           '\n' +
                           '  \'use strict\';\n' +
                           '\n\n\n',
                    // This string is appended to the file
                    end:   '\n\n\n' +
                           '    var dat = {\n' +
                           '        utils: {\n' +
                           '            css: dat_utils_css,\n' +
                           '            common: dat_utils_common,\n' +
                           '            requestAnimationFrame: dat_utils_requestAnimationFrame,\n' +
                           '        },\n' +
                           '        controller: {\n' +
                           '            Controller: dat_controllers_Controller,\n' +
                           '            OptionController: dat_controllers_OptionController,\n' +
                           '            NumberController: dat_controllers_NumberController,\n' +
                           '            NumberControllerBox: dat_controllers_NumberControllerBox,\n' +
                           '            NumberControllerSlider: dat_controllers_NumberControllerSlider,\n' +
                           '            StringController: dat_controllers_StringController,\n' +
                           '            FunctionController: dat_controllers_FunctionController,\n' +
                           '            BooleanController: dat_controllers_BooleanController,\n' +
                           '            ImageController: dat_controllers_ImageController,\n' +
                           '            ColorController: dat_controllers_ColorController,\n' +
                           '            factory: dat_controllers_factory,\n' +
                           '        },\n' +
                           '        dom: {\n' +
                           '            dom: dat_dom_dom,\n' +
                           '            CenteredDiv: dat_dom_CenteredDiv,\n' +
                           '        },\n' +
                           '        color: {\n' +
                           '            toString: dat_color_toString,\n' +
                           '            interpret: dat_color_interpret,\n' +
                           '            math: dat_color_math,\n' +
                           '            Color: dat_color_Color,\n' +
                           '        },\n' +
                           '        gui: {\n' +
                           '            GUI: dat_gui_GUI\n' +
                           '        }\n' +
                           '    };\n' +
                           '\n' +
                           '    return dat;\n' +
                           '}));\n\n'
                }
            },
            files: {
                'dist/jquery-ui.clean.js': [ 
                    'dist/jquery-ui.js' 
                ]
            }
        },
    },

	bowercopy: {
		all: {
			options: {
				clean: true,
				ignore: [ "jquery" ],
				destPrefix: "external"
			},
			files: {
				"qunit/qunit.js": "qunit/qunit/qunit.js",
				"qunit/qunit.css": "qunit/qunit/qunit.css",
				"qunit/MIT-LICENSE.txt": "qunit/MIT-LICENSE.txt",

				"jquery-mousewheel/jquery.mousewheel.js": "jquery-mousewheel/jquery.mousewheel.js",
				"jquery-mousewheel/LICENSE.txt": "jquery-mousewheel/LICENSE.txt",

				"jquery-simulate/jquery.simulate.js": "jquery-simulate/jquery.simulate.js",
				"jquery-simulate/LICENSE.txt": "jquery-simulate/LICENSE.txt",

				"jshint/jshint.js": "jshint/dist/jshint.js",
				"jshint/LICENSE": "jshint/LICENSE",

				"jquery/jquery.js": "jquery-1.x/jquery.js",
				"jquery/MIT-LICENSE.txt": "jquery-1.x/MIT-LICENSE.txt",

				"jquery-1.6.0/jquery.js": "jquery-1.6.0/jquery.js",
				"jquery-1.6.0/MIT-LICENSE.txt": "jquery-1.6.0/MIT-LICENSE.txt",

				"jquery-1.6.1/jquery.js": "jquery-1.6.1/jquery.js",
				"jquery-1.6.1/MIT-LICENSE.txt": "jquery-1.6.1/MIT-LICENSE.txt",

				"jquery-1.6.2/jquery.js": "jquery-1.6.2/jquery.js",
				"jquery-1.6.2/MIT-LICENSE.txt": "jquery-1.6.2/MIT-LICENSE.txt",

				"jquery-1.6.3/jquery.js": "jquery-1.6.3/jquery.js",
				"jquery-1.6.3/MIT-LICENSE.txt": "jquery-1.6.3/MIT-LICENSE.txt",

				"jquery-1.6.4/jquery.js": "jquery-1.6.4/jquery.js",
				"jquery-1.6.4/MIT-LICENSE.txt": "jquery-1.6.4/MIT-LICENSE.txt",

				"jquery-1.7.0/jquery.js": "jquery-1.7.0/jquery.js",
				"jquery-1.7.0/MIT-LICENSE.txt": "jquery-1.7.0/MIT-LICENSE.txt",

				"jquery-1.7.1/jquery.js": "jquery-1.7.1/jquery.js",
				"jquery-1.7.1/MIT-LICENSE.txt": "jquery-1.7.1/MIT-LICENSE.txt",

				"jquery-1.7.2/jquery.js": "jquery-1.7.2/jquery.js",
				"jquery-1.7.2/MIT-LICENSE.txt": "jquery-1.7.2/MIT-LICENSE.txt",

				"jquery-1.8.0/jquery.js": "jquery-1.8.0/jquery.js",
				"jquery-1.8.0/MIT-LICENSE.txt": "jquery-1.8.0/MIT-LICENSE.txt",

				"jquery-1.8.1/jquery.js": "jquery-1.8.1/jquery.js",
				"jquery-1.8.1/MIT-LICENSE.txt": "jquery-1.8.1/MIT-LICENSE.txt",

				"jquery-1.8.2/jquery.js": "jquery-1.8.2/jquery.js",
				"jquery-1.8.2/MIT-LICENSE.txt": "jquery-1.8.2/MIT-LICENSE.txt",

				"jquery-1.8.3/jquery.js": "jquery-1.8.3/jquery.js",
				"jquery-1.8.3/MIT-LICENSE.txt": "jquery-1.8.3/MIT-LICENSE.txt",

				"jquery-1.9.0/jquery.js": "jquery-1.9.0/jquery.js",
				"jquery-1.9.0/MIT-LICENSE.txt": "jquery-1.9.0/MIT-LICENSE.txt",

				"jquery-1.9.1/jquery.js": "jquery-1.9.1/jquery.js",
				"jquery-1.9.1/MIT-LICENSE.txt": "jquery-1.9.1/MIT-LICENSE.txt",

				"jquery-1.10.0/jquery.js": "jquery-1.10.0/jquery.js",
				"jquery-1.10.0/MIT-LICENSE.txt": "jquery-1.10.0/MIT-LICENSE.txt",

				"jquery-1.10.1/jquery.js": "jquery-1.10.1/jquery.js",
				"jquery-1.10.1/MIT-LICENSE.txt": "jquery-1.10.1/MIT-LICENSE.txt",

				"jquery-1.10.2/jquery.js": "jquery-1.10.2/jquery.js",
				"jquery-1.10.2/MIT-LICENSE.txt": "jquery-1.10.2/MIT-LICENSE.txt",

				"jquery-2.0.0/jquery.js": "jquery-2.0.0/jquery.js",
				"jquery-2.0.0/MIT-LICENSE.txt": "jquery-2.0.0/MIT-LICENSE.txt",

				"jquery-2.0.1/jquery.js": "jquery-2.0.1/jquery.js",
				"jquery-2.0.1/MIT-LICENSE.txt": "jquery-2.0.1/MIT-LICENSE.txt",

				"jquery-2.0.2/jquery.js": "jquery-2.0.2/jquery.js",
				"jquery-2.0.2/MIT-LICENSE.txt": "jquery-2.0.2/MIT-LICENSE.txt",

				"jquery-2.0.3/jquery.js": "jquery-2.0.3/jquery.js",
				"jquery-2.0.3/MIT-LICENSE.txt": "jquery-2.0.3/MIT-LICENSE.txt"
			}
		}
	},

	authors: {
		prior: [
			"Paul Bakaus <paul.bakaus@gmail.com>",
			"Richard Worth <rdworth@gmail.com>",
			"Yehuda Katz <wycats@gmail.com>",
			"Sean Catchpole <sean@sunsean.com>",
			"John Resig <jeresig@gmail.com>",
			"Tane Piper <piper.tane@gmail.com>",
			"Dmitri Gaskin <dmitrig01@gmail.com>",
			"Klaus Hartl <klaus.hartl@gmail.com>",
			"Stefan Petre <stefan.petre@gmail.com>",
			"Gilles van den Hoven <gilles@webunity.nl>",
			"Micheil Bryan Smith <micheil@brandedcode.com>",
			"Jörn Zaefferer <joern.zaefferer@gmail.com>",
			"Marc Grabanski <m@marcgrabanski.com>",
			"Keith Wood <kbwood@iinet.com.au>",
			"Brandon Aaron <brandon.aaron@gmail.com>",
			"Scott González <scott.gonzalez@gmail.com>",
			"Eduardo Lundgren <eduardolundgren@gmail.com>",
			"Aaron Eisenberger <aaronchi@gmail.com>",
			"Joan Piedra <theneojp@gmail.com>",
			"Bruno Basto <b.basto@gmail.com>",
			"Remy Sharp <remy@leftlogic.com>",
			"Bohdan Ganicky <bohdan.ganicky@gmail.com>"
		]
	}
});

grunt.registerMultiTask('amdclean', 'cleaning the combined dat.gui library', function() {
    var done = this.async();

    var files = this.files.slice();

    var options = this.options({
        verbose: false,
        transformAMDChecks: false,
        prefixMode: 'standard',
        prefixTransform: function(moduleName) {
            // console.log('prefixtransform: ', moduleName);
            // var name = moduleName.replace(/[\\\/_]/g, '.'); 
            // console.log('prefixtransform: ', moduleName, name);
            // return name; 
            return moduleName;
        },
    });

    function process() {
        if (files.length <= 0) {
            done();
            return;
        }

        files.forEach(function(file) {
          var srcfileset = file.src.filter(function(filepath) {
            // Remove nonexistent files (it's up to you to filter or warn here).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          });
    
          var output = srcfileset.map(function(filepath) {
            return grunt.file.read(filepath);
          }).join('\n\n');
          options.code = output;
          options.filePath = file.dest;

          var cleanedCode = amdclean.clean(options);

          grunt.file.write(file.dest, cleanedCode);
        });

        done();
    }

    process();
});

grunt.registerTask( "update-authors", function() {
	var getAuthors = require( "grunt-git-authors" ),
		done = this.async();

	getAuthors({
		priorAuthors: grunt.config( "authors.prior" )
	}, function( error, authors ) {
		if ( error ) {
			grunt.log.error( error );
			return done( false );
		}

		authors = authors.map(function( author ) {
			if ( author.match( /^Jacek Jędrzejewski </ ) ) {
				return "Jacek Jędrzejewski (http://jacek.jedrzejewski.name)";
			} else if ( author.match( /^Pawel Maruszczyk </ ) ) {
				return "Pawel Maruszczyk (http://hrabstwo.net)";
			} else {
				return author;
			}
		});

		grunt.file.write( "AUTHORS.txt",
			"Authors ordered by first contribution\n" +
			"A list of current team members is available at http://jqueryui.com/about\n\n" +
			authors.join( "\n" ) + "\n" );
		done();
	});
});

grunt.registerTask( "default", [ "lint", "sizer_all", "test" ]);
grunt.registerTask( "lint", [ "asciilint", "jshint", "jscs", "csslint", "htmllint" ]);
grunt.registerTask( "test", [ "qunit" ]);
grunt.registerTask( "sizer", [ "concat:ui", "uglify:main", "compare_size:all" ]);
grunt.registerTask( "sizer_all", [ "concat", "uglify", "compare_size" ]);

};
