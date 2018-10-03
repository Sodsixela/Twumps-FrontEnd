const browserify = require('browserify');
const gulp = require("gulp");
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const minify = require("gulp-babel-minify");
const strip = require('gulp-strip-comments');
const plumber = require("gulp-plumber");

let js_vendor_task = (config) => {
    return function () {
        let vendors = config.vendors || [];
        let connect = config.connect;
        const b = browserify({
            debug: true
        });
        vendors.forEach(lib => {
            b.require(lib);
        });
        let stream = b.bundle()
            .pipe(plumber())
            .pipe(source('vendor.min.js'))
            .pipe(buffer())
            .pipe(strip());
        //stream.pipe(minify());
        stream.pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    };
};

module.exports = js_vendor_task;