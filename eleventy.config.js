import path from "node:path";
import * as sass from "sass";
import markdownItAnchor from "markdown-it-anchor";
import { Topics, markdownItTopics, findMentions } from "./_lib/topics.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Same heading ids GitHub (and kramdown's GFM parser) generate, so existing #anchors keep working.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{Nd}\p{Pc}\- \t]/gu, "")
    .replace(/[ \t]/g, "-");
}

// GitHub Pages serves /foo from foo.html, so link without the extension.
function prettyUrl(url) {
  return url.replace(/\.html$/, "");
}

// Collections are rebuilt on every build, so caching on them never goes stale.
const topicsCache = new WeakMap();
function topicsOf(items) {
  if (!topicsCache.has(items)) {
    const definitions = items.map((item) => {
      const { title, categories, aliases = [], case_sensitive_aliases = [] } = item.data;
      if (!title || !categories?.length || aliases.length + case_sensitive_aliases.length === 0) {
        throw new Error(`${item.inputPath} needs a title, categories and aliases`);
      }
      return {
        slug: item.fileSlug,
        url: prettyUrl(item.url),
        title,
        aliases,
        caseSensitiveAliases: case_sensitive_aliases,
      };
    });
    topicsCache.set(items, new Topics(definitions));
  }
  return topicsCache.get(items);
}

// Topic slug -> [{ post, items }], newest post first, where items are the post's list items
// (as HTML) that mention the topic.
const discussionsCache = new WeakMap();
function discussionsOf(md, posts, topicItems) {
  if (!discussionsCache.has(posts)) {
    const topics = topicsOf(topicItems);
    const bySlug = new Map();
    for (const post of [...posts].reverse()) {
      const itemsBySlug = new Map();
      for (const { slug, html } of findMentions(md, post.rawInput, topics)) {
        if (!itemsBySlug.has(slug)) itemsBySlug.set(slug, []);
        itemsBySlug.get(slug).push(html);
      }
      for (const [slug, items] of itemsBySlug) {
        if (!bySlug.has(slug)) bySlug.set(slug, []);
        bySlug.get(slug).push({ post, items });
      }
    }
    discussionsCache.set(posts, bySlug);
  }
  return discussionsCache.get(posts);
}

export default function (eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("_offline/**");

  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Curly quotes and heading ids, like kramdown rendered them. Posts also link the topics they mention.
  let md;
  eleventyConfig.amendLibrary("md", (library) => {
    md = library
      .set({ typographer: true })
      .use(markdownItAnchor, { slugify, tabIndex: false })
      .use(markdownItTopics, (env) =>
        env.tags?.includes("posts") ? topicsOf(env.collections.topics) : undefined,
      );
  });

  eleventyConfig.addFilter("topic_discussions", (posts, topicItems, slug) =>
    discussionsOf(md, posts, topicItems).get(slug) ?? [],
  );
  eleventyConfig.addFilter("topic", (topicItems, slug) => {
    const topic = topicItems.find((item) => item.fileSlug === slug);
    if (!topic) throw new Error(`Unknown topic "${slug}"`);
    return topic;
  });
  // [{ name, topics }], categories and the topics in each sorted by name.
  eleventyConfig.addFilter("topic_categories", (topicItems) => {
    const byName = (a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" });
    const names = [...new Set(topicItems.flatMap((item) => item.data.categories))].sort(byName);
    return names.map((name) => ({
      name,
      topics: topicItems
        .filter((item) => item.data.categories.includes(name))
        .sort((a, b) => byName(a.data.title, b.data.title)),
    }));
  });

  // 09 Sep 2026. Dates come from post filenames as UTC midnight, so format in UTC.
  eleventyConfig.addFilter("date_to_string", (date) => {
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("date_to_xmlschema", (date) => date.toISOString());
  eleventyConfig.addFilter("pretty_url", prettyUrl);

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
