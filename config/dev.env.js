'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   baseurl:'"http://localhost:6003"',
 //  VUE_APP_BASE_API: '"http://localhost:1140"',
})
