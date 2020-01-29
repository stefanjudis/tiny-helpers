const htmlmin = require('html-minifier');
const Terser = require('terser');
const { NODE_ENV } = process.env;

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ static: '.' });

  eleventyConfig.addFilter('jsmin', function(code) {
    let minified = Terser.minify(code);
    if (minified.error) {
      console.log('Terser error: ', minified.error);
      return code;
    }

    return minified.code;
  });

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

  eleventyConfig.addNunjucksFilter('route', function(slug, { listIsSortedBy }) {
    // in production the home dir is mapped to root
    if (NODE_ENV === 'production' && slug === 'home') {
      slug = '';
    }

    let route = slug.length ? `/${slug}/` : '/';

    if (listIsSortedBy === 'addedAt') {
      route += 'latest/';
    }

    return route;
  });

  eleventyConfig.addNunjucksFilter('prettyDate', function(dateString) {
    const date = new Date(dateString);
    const regex = /^(?<day>\w+?)\s(?<month>\w+?)\s(?<date>\w+?) (?<year>\d+?)$/;
    const matched = date.toDateString().match(regex);

    if (matched) {
      const { month, year } = matched.groups;
      return `${month} ${year}`;
    }

    return dateString;
  });
};
