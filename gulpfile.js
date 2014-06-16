var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	prettify = require('gulp-prettify'),
	htmlmin = require('gulp-htmlmin'),
	prefixr = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync'),
	path = {},
	dev;

function setPaths () {
	path = {
		src: './src/',
		build: './build/',
		dist: './dist/'
	};

	path.dest = (dev) ? path.build : path.dist;

	path.js = {
		watch: path.src + 'js/*.js',
		src: path.src + 'js/*.js',
		dest: path.dest + 'js/'
	};

	path.css = {
		watch: path.src + 'css/*.css',
		src: path.src + 'css/*.css',
		dest: path.dest + 'css/'
	};

	path.html = {
		watch: path.src + '*.html',
		src: path.src + '*.html',
		dest: path.dest
	};

	path.img = {
		watch: path.src + 'img/**/*',
		src: path.src + 'img/**/*',
		dest: path.dest + 'img/'
	};
}

gulp.task('html', function () {
	if (dev) {
		gulp.src(path.html.src)
			.pipe(prettify())
			.pipe(gulp.dest(path.html.dest));
	} else {
		gulp.src(path.html.src)
			.pipe(prettify())
			.pipe(htmlmin({
				removeComments: true,
				useShortDoctype: true,
				collapseWhitespace: true,
				minifyJS: true,
				minifyCSS: true
			}))
			.pipe(gulp.dest(path.html.dest));
	}
});

gulp.task('css', function () {
	if (dev) {
		gulp.src(path.css.src)
			.pipe(prefixr())
			.pipe(gulp.dest(path.css.dest));
	} else {
		gulp.src(path.css.src)
			.pipe(prefixr())
			.pipe(minifyCSS())
			.pipe(gulp.dest(path.css.dest));
	}
});

gulp.task('js', function () {
	if (dev) {
		gulp.src(path.js.src)
			.pipe(jshint())
			.pipe(jshint.reporter('default'))
			.pipe(gulp.dest(path.js.dest));
	} else {
		gulp.src(path.js.src)
			.pipe(uglify())
			.pipe(gulp.dest(path.js.dest));
	}
});

gulp.task('img', function () {
	gulp.src(path.img.src)
		.pipe(imagemin())
		.pipe(gulp.dest(path.img.dest));
});

gulp.task('copy', function () {
	var files = [
		path.src + '*',
		path.src + 'img/**',
		path.src + 'font/**',
		path.src + 'dependencies/**',
		'!' + path.src + '*.html',
		'!' + path.src + 'css',
		'!' + path.src + 'js'
	];

	gulp.src(files, {base: path.src})
		.pipe(gulp.dest(path.dest));
});

gulp.task('browser-sync', function () {
	browserSync.init([
		path.html.dest + '*.html',
		path.css.dest + '*.css',
		path.js.dest + '*.js',
		path.img.dest + '**/*'
	], {
		server: {
			baseDir: path.dest
		}
	});
});

gulp.task('watch', function () {
	gulp.watch([path.html.watch], ['html']);
	gulp.watch([path.css.watch], ['css']);
	gulp.watch([path.js.watch], ['js']);
	gulp.watch([path.img.watch], ['img']);
});

gulp.task('setBuild', function () {
	dev = true;
	setPaths();
});
gulp.task('setDist', function () {
	dev = false;
	setPaths();
});
gulp.task('run', ['html', 'css', 'js', 'img', 'copy']);
gulp.task('build', ['setBuild', 'run']);
gulp.task('dist', ['setDist', 'run']);
gulp.task('default', ['build', 'browser-sync', 'watch']);
