const gulp = require("gulp");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const plumber = require("gulp-plumber");

let css_vendor_task = (config) => {
    return () => {
        let connect = config.connect;
        let stream = gulp.src(config.src)
            .pipe(plumber())
            .pipe(replace('?v=4.7.0', ''))
            .pipe(concat('vendors.min.css'))
            .pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    };
};

module.exports = css_vendor_task;

