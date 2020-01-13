const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: 'js/index.js',
  output: {
    file: 'site/_includes/main.js',
    format: 'esm'
  },
  plugins: [process.env.NODE_ENV === 'production' ? terser() : null]
};
