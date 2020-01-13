const htmlmin = require('html-minifier');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static');

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

  eleventyConfig.addLiquidFilter('json', function(value) {
    return JSON.stringify(value);
  });
};
