import path from "node:path";
import * as sass from "sass";
import markdownItAnchor from "markdown-it-anchor";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Same heading ids GitHub (and kramdown's GFM parser) generate, so existing #anchors keep working.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{Nd}\p{Pc}\- \t]/gu, "")
    .replace(/[ \t]/g, "-");
}

export default function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("_offline/**");

  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Curly quotes and heading ids, like kramdown rendered them.
  eleventyConfig.amendLibrary("md", (md) =>
    md.set({ typographer: true }).use(markdownItAnchor, { slugify, tabIndex: false }),
  );

  // 09 Sep 2026. Dates come from post filenames as UTC midnight, so format in UTC.
  eleventyConfig.addFilter("date_to_string", (date) => {
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("date_to_xmlschema", (date) => date.toISOString());
  // GitHub Pages serves /foo from foo.html, so link without the extension.
  eleventyConfig.addFilter("pretty_url", (url) => url.replace(/\.html$/, ""));

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    getData: () => ({ eleventyExcludeFromCollections: true }),
    compile(inputContent, inputPath) {
      const { name, dir } = path.parse(inputPath);
      // Partials are only pulled in through @import.
      if (name.startsWith("_")) return;

      const result = sass.compileString(inputContent, {
        loadPaths: [dir],
        style: "compressed",
        silenceDeprecations: ["import"],
      });
      this.addDependencies(inputPath, result.loadedUrls);
      return () => result.css;
    },
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site",
    },
  };
}
