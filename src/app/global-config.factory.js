"use strict";
let global_config_factory = () => {
	const url_server = "http://localhost:5000/";
	const url_back = "http://ec2-35-180-103-82.eu-west-3.compute.amazonaws.com/";
	return {
		url_server,
		url_back
	};
};
module.exports = global_config_factory;