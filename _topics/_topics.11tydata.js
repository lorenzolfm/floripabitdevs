// Topics live at /topics/slug, slug being the file name. Posts link to them through the aliases.
export default {
  layout: "topic",
  tags: "topics",
  permalink: ({ page }) => `/topics/${page.fileSlug}.html`,
};
