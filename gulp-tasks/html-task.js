"use strict";

const gulp = require("gulp");
const html_min = require('gulp-htmlmin');
const plumber = require("gulp-plumber");

let html_task = (config) => {
    return () => {
        let connect = config.connect;
        let stream = gulp.src(config.src)
            .pipe(plumber())
            .pipe(html_min({collapseWhitespace: true}))
            .pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    }
};

module.exports = html_task;