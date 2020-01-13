module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('static');

  eleventyConfig.addLiquidFilter('json', function(value) {
    return JSON.stringify(value);
  });
};
