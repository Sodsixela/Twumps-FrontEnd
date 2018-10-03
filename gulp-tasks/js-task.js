const browserify = require('browserify');
const gulp = require("gulp");
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const gutil = require("gulp-util");
const minify = require("gulp-babel-minify");
const strip = require('gulp-strip-comments');
const plumber = require("gulp-plumber");

let js_task = (config) => {
    return function () {
        let vendors = config.vendors || [];
        let connect = config.connect;
        let stream = browserify({
            entries: config.src,
            extensions: ['.js'],
            debug: true
        })
            .external(vendors)
            .transform(babelify)
            .bundle()
            .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            })
            .pipe(source('app.min.js'))
            .pipe(buffer())
            .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            })
            .pipe(strip())
            .pipe(minify())
            .pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    };
};

module.exports = js_task;