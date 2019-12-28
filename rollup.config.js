const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: 'src/browser.js',
  output: {
    file: 'static/bundle.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    commonjs(),
    process.env.NODE_ENV === 'production' ? terser() : null
  ]
};
