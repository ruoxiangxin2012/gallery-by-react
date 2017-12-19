const path = require('path');
const paths = require('./paths');

const resolveSrc = relativePath => path.resolve(paths.appSrc, relativePath);

module.exports = {
  assets: resolveSrc('assets'),
  components: resolveSrc('components'),
  styles: resolveSrc('styles'),
  mock: resolveSrc('mock'),
};