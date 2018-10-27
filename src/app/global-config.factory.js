"use strict";
let global_config_factory = () => {
    const url_server = "http://localhost:5000/";
    const url_back = "http://localhost:3005/";
    return {
        url_server, url_back
    };
};
module.exports = global_config_factory;