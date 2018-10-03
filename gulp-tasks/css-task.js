"use strict";
const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");

let css_task = (config) => {
    return () => {
        let connect = config.connect;
        let stream = gulp.src(config.src)
            .pipe(plumber())
            .pipe(sass())
            .pipe(concat('style.min.css'))
            .pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    };
};

module.exports = css_task;