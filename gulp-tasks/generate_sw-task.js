"use strict";
const swPrecache = require('sw-precache');

let generate_sw_task = (config) => {
    return function (done) {
        let rootDir = config.dest;
        let connect = config.connect;
        swPrecache.write(`${rootDir}/sw.js`, {
            staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2,otf}'],
            stripPrefix: rootDir,
            maximumFileSizeToCacheInBytes: 8097152
        }, () => {
            if(connect){
                connect.reload();
            }
            done();
        });
    };
};

module.exports = generate_sw_task;

