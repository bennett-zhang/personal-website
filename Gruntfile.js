"use strict"

module.exports = grunt => {
	require("load-grunt-tasks")(grunt)

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		banner: "/*! <%= pkg.name %> v<%= pkg.version %> | <%= grunt.template.today('yyyy-mm-dd') %> | (c) <%= pkg.author %> | <%= pkg.repository.url %> */",
		bowercopy: {
			fonts: {
				files: {
					"fontawesome-webfont.woff2": "font-awesome/fonts/fontawesome-webfont.woff2",
					"fontawesome-webfont.woff": "font-awesome/fonts/fontawesome-webfont.woff",
					"fontawesome-webfont.ttf": "font-awesome/fonts/fontawesome-webfont.ttf",
					"fontawesome-webfont.svg": "font-awesome/fonts/fontawesome-webfont.svg"
				},
				options: {
					destPrefix: "public/fonts"
				}
			}
		},
		pug: {
			dist: {
				files: {
					"public/index.html": "views/pages/index.pug"
				}
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: "assets/img",
					src: ["**/*.{png,jpg,gif,svg}"],
					dest: "public/img"
				}]
			}
		},
		browserify: {
			dist: {
				files: {
					"public/js/fancify.min.js": "assets/js/fancify.js"
				}
			},
			options: {
				transform: [
					["babelify", {
						presets: "es2015"
					}]
				]
			}
		},
		concat: {
			dist: {
				files: {
					"public/js/fancify.min.js": [
						"bower_components/jquery/dist/jquery.min.js",
						"bower_components/popper.js/dist/umd/popper.min.js",
						"bower_components/bootstrap/dist/js/bootstrap.min.js",
						"bower_components/inview/jquery.inview.min.js",
						"bower_components/typed.js/lib/typed.min.js",
						"bower_components/trianglify/dist/trianglify.min.js",
						"public/js/fancify.min.js"
					]
				}
			}
		},
		uglify: {
			dist: {
				files: {
					"public/js/fancify.min.js": "public/js/fancify.min.js"
				},
				options: {
					banner: "<%= banner %>"
				}
			}
		},
		sass: {
			dist: {
				files: {
					"public/css/master.min.css": "assets/scss/master.scss"
				},
				options: {
					includePaths: ["bower_components"]
				}
			}
		},
		uncss: {
			dist: {
				files: {
					"public/css/master.min.css": "public/*.html"
				},
				options: {
					ignore: [
						".collapse",
						".collapsing",
						".collapse.show",
						".animated",
						".reveal",
						".typed-cursor"
					]
				}
			}
		},
		autoprefixer: {
			dist: {
				files: {
					"public/css/master.min.css": "public/css/master.min.css"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					"public/css/master.min.css": "public/css/master.min.css"
				},
				options: {
					level: {
						1: {
							specialComments: 0
						}
					}
				}
			}
		},
		usebanner: {
			dist: {
				files: {
					"public/css/master.min.css": ["public/css/master.min.css"]
				},
				options: {
					position: "top",
					banner: "<%= banner %>",
					linebreak: true
				}
			}
		},
		watch: {
			pug: {
				files: "views/**/*.pug",
				tasks: ["pug"]
			},
			img: {
				files: "assets/img/**/*.{png,jpg,gif,svg}",
				tasks: ["imagemin"]
			},
			js: {
				files: "assets/js/**/*.js",
				tasks: [
					"browserify",
					"concat",
					"uglify"
				]
			},
			scss: {
				files: "assets/scss/**/*.scss",
				tasks: [
					"sass",
					"uncss",
					"autoprefixer",
					"cssmin",
					"usebanner"
				]
			}
		},
		nodemon: {
			dev: {
				script: "index.js"
			}
		},
		concurrent: {
			dev: [
				"watch",
				"nodemon"
			],
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.registerTask("default", [
		"bowercopy",
		"concurrent"
	])
}
