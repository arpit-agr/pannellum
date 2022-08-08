const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const sortByDisplayOrder = require('./src/_11ty/utils/sort-by-display-order.js');

module.exports = function(eleventyConfig) {
  eleventyConfig.setQuietMode(true);

  // Collections
	eleventyConfig.addCollection("pages", function(collectionApi) {
		return sortByDisplayOrder(collectionApi.getFilteredByGlob("./src/pages/*.md"));
	});

  //Plugins
  eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  //Passthrough copy
	eleventyConfig.addPassthroughCopy("./src/images");
	eleventyConfig.addPassthroughCopy("./src/scripts");
  // eleventyConfig.addPassthroughCopy("./src/fonts");
  // eleventyConfig.addPassthroughCopy("./src/favicon.ico");
	// eleventyConfig.addPassthroughCopy("./src/icon.svg");
	// eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
	// eleventyConfig.addPassthroughCopy("./src/icon-192.png");
	// eleventyConfig.addPassthroughCopy("./src/icon-512.png");
	// eleventyConfig.addPassthroughCopy("./src/manifest.webmanifest");

  //Watch target
	// eleventyConfig.addWatchTarget("./src/_includes/css/");
	// eleventyConfig.addWatchTarget('./src/scripts/');

  //Filter
  eleventyConfig.addFilter("cssmin", function(code) {
    if(process.env.NODE_ENV === "production") {
      return new CleanCSS({}).minify(code).styles;
    }
    else {
      return code
    }
  });
  eleventyConfig.addFilter("addNbsp", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*))$/g, "$2&nbsp;$3");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  //Transforms
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if(process.env.NODE_ENV === "production" && this.outputPath && this.outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true
      });
      return minified;
    }

    return content;
  });

  return {
    // dataTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
		dir: {
			input: 'src',
			output: 'public'
		}
	};
};