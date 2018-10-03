"use strict";
let global_config_factory = () => {
    const url_server = "http://127.0.0.1:5000";
    const url_back = "http://127.0.0.1:3005/";
    return {
        url_server, url_back
    };
};
module.exports = global_config_factory;