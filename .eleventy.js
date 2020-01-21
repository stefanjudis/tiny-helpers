const htmlmin = require('html-minifier');
const Terser = require('terser');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ static: '.' });

  //
  // filters
  eleventyConfig.addFilter('jsmin', function(code) {
    let minified = Terser.minify(code);
    if (minified.error) {
      console.log('Terser error: ', minified.error);
      return code;
    }

    return minified.code;
  });

  //
  // transforms
  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });
};
