import path from "node:path";

// Posts live at /YYYY-MM-DD-slug, the URLs the Jekyll site used.
export default {
  layout: "post",
  tags: "posts",
  permalink: ({ page }) => `/${path.basename(page.inputPath, ".md")}.html`,
};
