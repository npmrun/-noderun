'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/xbrowser.cjs.prod.js')
} else {
  module.exports = require('./dist/xbrowser.cjs.js')
}
