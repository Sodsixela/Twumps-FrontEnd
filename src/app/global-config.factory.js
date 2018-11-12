'use strict'
let global_config_factory = () => {
  const urlServer = 'https://localhost:5000/'
  const urlBack = 'https://ec2-35-180-103-82.eu-west-3.compute.amazonaws.com/'
  return {
    urlServer,
    urlBack
  }
}
module.exports = global_config_factory
