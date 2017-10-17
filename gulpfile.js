"use strict"

const gulp = require("gulp")
const $ = require("gulp-load-plugins")()
const del = require("del")
const runSequence = require("run-sequence")
const pkg = require("./package.json")

const babelify = require("babelify")
const browserify = require("browserify")
const buffer = require("vinyl-buffer")
const source = require("vinyl-source-stream")

const banner = `/*!
 * ${pkg.name} v${pkg.version} (${pkg.homepage})
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license} (https://github.com/bennett-zhang/personal-website/blob/master/LICENSE)
 */`

let rebuild = false

const postcssPlugins = [
	require("postcss-uncss")({
		html: ["dist/**/*.html"],
		ignore: [
			/\.collaps/,
			/\.fade/,
			/\.tooltip/,
			/\.fixed-top/,
			".animated",
			".reveal",
			".typed-cursor"
		]
	}),
	require("autoprefixer"),
	require("cssnano")
]

gulp.task("views", () => {
	return gulp.src("src/views/*.pug")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist")))
		.pipe($.pug())
		.pipe($.htmlmin())
		.pipe(gulp.dest("dist"))
})

gulp.task("scripts", () => {
	return browserify({
		entries: ["src/scripts/fancify.js"],
		debug: true,
		paths: [
			"bower_components/jquery/dist",
			"bower_components/popper.js/dist",
			"bower_components/bootstrap/dist/js",
			"bower_components/trianglify/dist",
			"bower_components/inview",
			"bower_components/typed.js/lib"
		],
		transform: [
			babelify.configure({
				presets: ["env"]
			})
		]
	})
		.bundle()
		.on("error", err => {
			console.log(`Error: ${err.message}`)
		})
		.pipe($.plumber())
		.pipe(source("fancify.js"))
		.pipe(buffer())
		.pipe($.if(!rebuild, $.changed("dist/scripts")))
		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: ".min"
		}))
		.pipe($.banner(banner))
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest("dist/scripts"))
})

gulp.task("styles", () => {
	return gulp.src("src/styles/**/[^_]*.scss")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/styles")))
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			includePaths: [
				"bower_components/bootstrap/scss",
				"bower_components/font-awesome/scss",
				"bower_components/animate.css"
			]
		}).on("error", $.sass.logError))
		.pipe($.postcss(postcssPlugins))
		.pipe($.rename({
			suffix: ".min"
		}))
		.pipe($.banner(banner))
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest("dist/styles"))
})

gulp.task("images", () => {
	return gulp.src("src/images/**/*.{png,jpg,gif,svg,ico}")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/images")))
		.pipe($.imagemin())
		.pipe(gulp.dest("dist/images"))
})

gulp.task("fonts", () => {
	return gulp.src([
		"src/fonts/**/*.{woff2,woff}",
		"bower_components/font-awesome/fonts/**/*.{woff2,woff}"
	])
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/fonts")))
		.pipe(gulp.dest("dist/fonts"))
})

gulp.task("pdfs", () => {
	return gulp.src("src/pdfs/**/*.pdf")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/pdfs")))
		.pipe(gulp.dest("dist/pdfs"))
})

gulp.task("other", () => {
	return gulp.src("src/*")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist")))
		.pipe(gulp.dest("dist"))
})

gulp.task("watch", () => {
	rebuild = false
	gulp.watch("src/views/**/*.pug", ["views"])
	gulp.watch("src/scripts/**/*.js", ["scripts"])
	gulp.watch("src/styles/**/*.scss", ["styles"])
	gulp.watch("src/images/**/*.{png,jpg,gif,svg,ico}", ["images"])
	gulp.watch("src/fonts/**/*.{woff2,woff}", ["fonts"])
	gulp.watch("src/pdfs/**/*.pdf", ["pdfs"])
	gulp.watch("src/*", ["other"])
})

gulp.task("start", () => {
	$.nodemon({
		script: "index.js"
	})
})

gulp.task("default", [
	"watch",
	"start"
])

gulp.task("rebuild", () => {
	rebuild = true

	del("dist").then(() => {
		runSequence([
			"views",
			"scripts",
			"images",
			"fonts",
			"pdfs",
			"other"
		], "styles", "default")
	})
})
