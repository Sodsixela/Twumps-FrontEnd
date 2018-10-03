"use strict";
const gulp = require("gulp");
const plumber = require("gulp-plumber");

let copy_task = (config) => {
    return () => {
        let connect = config.connect;
        let stream = gulp.src(config.src)
            .pipe(plumber())
            .pipe(gulp.dest(config.dest));
        if(connect){
            stream.pipe(connect.reload());
        }
        return stream;
    }
};

module.exports = copy_task;