const slugify = require('slugify');

const toSlug = name => slugify(name).toLocaleLowerCase();

module.exports.toSlug = toSlug;
