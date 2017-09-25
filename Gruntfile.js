module.exports = grunt => {
	require("load-grunt-tasks")(grunt)

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
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
					src: ["**/*.{png,jpg,gif}"],
					dest: "public/img"
				}]
			}
		},
		sass: {
			dist: {
				files: {
					"public/css/master.css": "assets/scss/master.scss"
				}
			}
		},
		uncss: {
			dist: {
				files: {
					"public/css/master.css": ["public/*.html"]
				}
			}
		},
		autoprefixer: {
			dist: {
				files: {
					"public/css/master.css": "public/css/master.css"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					"public/css/master.css": ["public/css/master.css"]
				}
			}
		},
		usebanner: {
			dist: {
				options: {
					position: "top",
					banner: "/*! <%= pkg.name %> v<%= pkg.version %> | <%= grunt.template.today('yyyy-mm-dd') %> | (c) <%= pkg.author %> | <%= pkg.repository.url %> */",
					linebreak: true
				},
				files: {
					"public/css/master.css": ["public/css/master.css"]
				}
			}
		},
		watch: {
			pug: {
				files: "views/**/*.pug",
				tasks: ["pug"]
			},
			img: {
				files: "assets/img/**/*.{png,jpg,gif}",
				tasks: ["imagemin"]
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

	grunt.registerTask("default", ["concurrent"])
}
