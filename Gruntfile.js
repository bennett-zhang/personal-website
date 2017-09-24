module.exports = grunt => {
	require("load-grunt-tasks")(grunt)

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				files: {
					"public/css/master.css": "assets/scss/master.scss"
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
		run: {
			your_target: {
				cmd: "node",
				args: [
					"index.js"
				]
			}
		},
		watch: {
			css: {
				files: "assets/scss/*.scss",
				tasks: ["sass", "autoprefixer"]
			}
		}
	})

	grunt.registerTask("default", ["sass", "autoprefixer", "run"])
}
