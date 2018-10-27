const gulp = require("gulp");
const connect = require('gulp-connect');

const copy_task = require("./gulp-tasks/copy-task");
const css_task = require("./gulp-tasks/css-task");
const css_vendor_task = require("./gulp-tasks/css_vendor-task");
const generate_sw_task = require("./gulp-tasks/generate_sw-task");
const js_vendors_task = require("./gulp-tasks/js_vendors-task");
const js_task = require("./gulp-tasks/js-task");
const html_task = require("./gulp-tasks/html-task");

const lib_path = "node_modules";
const dest_folder = './dist/';

const js_deps = [ "angular", "@uirouter/angularjs"];

gulp.task("html", html_task({src : ['src/**/*.html'], dest : dest_folder, connect : connect}));
gulp.task("css", css_task({src : ["src/app/base.sass"], dest : dest_folder + "/app/", connect : connect}));
gulp.task("asset", copy_task({src : ["src/asset/**/*.*"], dest : dest_folder + "/asset", connect : connect}));
gulp.task("font", copy_task({src : [lib_path + "/font-awesome/fonts/*.*"], dest : dest_folder + "/fonts", connect : connect}));
//gulp.task("vendors_css", css_vendor_task({src : css_deps, dest : dest_folder, connect : connect}));

gulp.task('generate-service-worker', generate_sw_task({dest : dest_folder, connect : connect}));
gulp.task('vendors_js', js_vendors_task({dest : dest_folder, vendors : js_deps, connect : connect}));
gulp.task('js', js_task({vendors : js_deps, src : ['./src/app/app.js'], dest : dest_folder, connect : connect}));

gulp.task('build', ['html',"css", "font", 'asset', "vendors_js", "js"]);
gulp.task('watch', ['html',"css", "font", 'asset', "vendors_js", "js"], function () {
    connect.server({
        root: ["dist"],
        livereload: true,
        base: 'http://localhost',
        port: 5000
    });
    connect.reload();
    gulp.watch('./src/**/*.sass', ['css']);
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/**/*.js', ['js']);
});
