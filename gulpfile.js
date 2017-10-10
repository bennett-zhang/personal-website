const gulp = require("gulp")
const gulpLoadPlugins = require("gulp-load-plugins")
const $ = gulpLoadPlugins()
const del = require("del")
const runSequence = require("run-sequence")
const pkg = require("./package.json")
const banner = `<%= pkg.name %> v<%= pkg.version %> | ${new Date().toJSON().slice(0,10)} | (c) <%= pkg.author %> | <%= pkg.repository.url %>`

let rebuild = false

const plugins = [
	require("postcss-uncss")({
		html: ["dist/**/*.html"],
		ignore: [
			".collapse",
			".collapsing",
			".collapse.show",
			".animated",
			".reveal",
			".typed-cursor"
		]
	}),
	$.autoprefixer,
	require("cssnano")
]

gulp.task("views", () => {
	return gulp.src("src/views/*.pug")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist")))
		.pipe($.pug())
		.pipe($.htmlmin())
		.pipe($.banner(`<!-- ${banner} -->\n`, {pkg}))
		.pipe(gulp.dest("dist"))
})

gulp.task("scripts", () => {
	gulp.src([
		"bower_components/jquery/dist/jquery.min.js",
		"bower_components/popper.js/dist/umd/popper.min.js{,.map}",
		"bower_components/bootstrap/dist/js/bootstrap.min.js",
		"bower_components/inview/jquery.inview.min.js",
		"bower_components/typed.js/lib/typed.min.js{,.map}",
		"bower_components/trianglify/dist/trianglify.min.js"
	])
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/scripts")))
		.pipe(gulp.dest("dist/scripts"))

	return gulp.src("src/scripts/**/*.js")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/scripts")))
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			"presets": ["env"]
		}))
		.pipe($.uglify())
		.pipe($.rename({
			suffix: ".min"
		}))
		.pipe($.banner(`/* ${banner} */\n`, {pkg}))
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest("dist/scripts"))
})

gulp.task("styles", () => {
	return gulp.src("src/styles/**/*.scss")
		.pipe($.plumber())
		.pipe($.if(!rebuild, $.changed("dist/styles")))
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			includePaths: ["bower_components"]
		}).on("error", $.sass.logError))
		.pipe($.postcss(plugins))
		.pipe($.rename({
			suffix: ".min"
		}))
		.pipe($.banner(`/* ${banner} */\n`, {pkg}))
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest("dist/styles"))
})

gulp.task("images", () => {
	return gulp.src("src/images/**/*.{png,jpg,gif,svg}")
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

gulp.task("watch", () => {
	rebuild = false
	gulp.watch("src/views/**/*.pug", ["views"])
	gulp.watch("src/scripts/**/*.js", ["scripts"])
	gulp.watch("src/styles/**/*.scss", ["styles"])
	gulp.watch("src/images/**/*.{png,jpg,gif,svg}", ["images"])
	gulp.watch("src/fonts/**/*.{woff2,woff}", ["fonts"])
	gulp.watch("src/pdfs/**/*.pdf", ["pdfs"])
})

gulp.task("start", () => {
	$.nodemon({
		script: "index.js"
	})
})

gulp.task("rebuild", () => {
	rebuild = true

	del("dist").then(() => {
		runSequence([
			"views",
			"scripts",
			"images",
			"fonts",
			"pdfs"
		], "styles", [
			"watch",
			"start"
		])
	})
})

gulp.task("default", [
	"watch",
	"start"
])
