// Finds topic names in post text. Posts use it to link to topic pages, and topic pages use it
// to list every post item that mentions them, so both always agree.

const LETTER = "\\p{L}_";
const WORD = "\\p{L}\\p{N}_";

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Spaces and hyphens in an alias match a space, a hyphen or nothing, so "BIP 324" matches
// "BIP324" and "BIP-324". Aliases ending in a letter also match their plural ("covenants")
// and may touch a digit ("testnet4", "BitVM3"); aliases ending in a digit may not, so
// "BIP 3" doesn't match "BIP 340".
function aliasRegExp(alias, caseSensitive) {
  const text = alias.trim();
  const body = text.split(/[\s-]+/).map(escapeRegExp).join("[\\s-]?");
  const before = /^\p{L}/u.test(text) ? LETTER : WORD;
  const endsInLetter = /\p{L}$/u.test(text);
  const after = endsInLetter ? LETTER : WORD;
  const plural = endsInLetter ? "s?" : "";
  return new RegExp(`(?<![${before}])${body}${plural}(?![${after}])`, caseSensitive ? "gu" : "giu");
}

export class Topics {
  // definitions: [{ slug, url, title, aliases, caseSensitiveAliases }]
  constructor(definitions) {
    this.bySlug = new Map(definitions.map((topic) => [topic.slug, topic]));
    this.patterns = definitions.flatMap((topic) => [
      ...topic.aliases.map((alias) => ({ slug: topic.slug, regexp: aliasRegExp(alias, false) })),
      ...topic.caseSensitiveAliases.map((alias) => ({ slug: topic.slug, regexp: aliasRegExp(alias, true) })),
    ]);
  }

  get(slug) {
    return this.bySlug.get(slug);
  }

  // Non-overlapping spans of `text` that name a topic, as [{ start, end, slugs }]. Where
  // aliases overlap the longest wins, so "Taproot Assets" isn't also "Taproot". A span has
  // several slugs only when several topics share the alias.
  find(text) {
    const hits = [];
    for (const { slug, regexp } of this.patterns) {
      for (const match of text.matchAll(regexp)) {
        hits.push({ start: match.index, end: match.index + match[0].length, slug });
      }
    }
    hits.sort((a, b) => a.start - b.start || b.end - a.end);

    const spans = [];
    for (const hit of hits) {
      const last = spans.at(-1);
      if (last && last.start === hit.start && last.end === hit.end) {
        if (!last.slugs.includes(hit.slug)) last.slugs.push(hit.slug);
      } else if (!last || hit.start >= last.end) {
        spans.push({ start: hit.start, end: hit.end, slugs: [hit.slug] });
      }
    }
    return spans;
  }
}

// Headings name sections ("### Quantum"), not discussions, so they're left alone.
function isBody(tokens, i) {
  return tokens[i].type === "inline" && tokens[i - 1]?.type !== "heading_open";
}

function slugsIn(children, topics) {
  const slugs = new Set();
  for (const child of children) {
    if (child.type !== "text") continue;
    for (const span of topics.find(child.content)) span.slugs.forEach((slug) => slugs.add(slug));
  }
  return slugs;
}

// markdown-it plugin. `topicsFor(env)` returns the Topics to link in that document, or nothing
// to leave it untouched.
export function markdownItTopics(md, topicsFor) {
  md.core.ruler.push("topics", (state) => {
    const topics = topicsFor(state.env);
    if (!topics) return;
    state.tokens.forEach((token, i) => {
      if (isBody(state.tokens, i)) token.children = linkTopics(token.children, topics, state.Token);
    });
  });
}

// How a token changes link nesting. Inline HTML <a> tags count too, tested the way markdown-it
// tests them for linkify.
function linkDepthChange(token) {
  if (token.type === "link_open") return 1;
  if (token.type === "link_close") return -1;
  if (token.type !== "html_inline") return 0;
  if (/^<a[>\s]/i.test(token.content)) return 1;
  if (/^<\/a\s*>/i.test(token.content)) return -1;
  return 0;
}

// Links the first mention of each topic in a paragraph or list item. Links can't nest, so a
// topic named inside a link (the usual case: "* [Silent Payments light clients](...)") gets a
// tag after the item instead.
function linkTopics(children, topics, Token) {
  const out = [];
  const linked = new Set();
  const tagged = new Set();
  let linkDepth = 0;

  const text = (content) => Object.assign(new Token("text", "", 0), { content });
  const link = (slug, content, className) => {
    const topic = topics.get(slug);
    const open = new Token("link_open", "a", 1);
    open.attrs = [["href", topic.url], ["class", className], ["title", topic.title]];
    return [open, text(content), new Token("link_close", "a", -1)];
  };

  for (const child of children) {
    linkDepth += linkDepthChange(child);
    if (child.type !== "text") {
      out.push(child);
      continue;
    }

    const spans = topics.find(child.content);
    if (linkDepth > 0) {
      for (const span of spans) span.slugs.forEach((slug) => tagged.add(slug));
      out.push(child);
      continue;
    }

    let position = 0;
    for (const span of spans) {
      const [slug, ...others] = span.slugs;
      others.forEach((other) => tagged.add(other));
      if (linked.has(slug)) continue;
      linked.add(slug);
      if (span.start > position) out.push(text(child.content.slice(position, span.start)));
      out.push(...link(slug, child.content.slice(span.start, span.end), "Topic-link"));
      position = span.end;
    }
    if (position < child.content.length) out.push(text(child.content.slice(position)));
  }

  const tags = [...tagged].filter((slug) => !linked.has(slug));
  if (tags.length > 0) {
    out.push(text(" "), Object.assign(new Token("html_inline", "", 0), { content: '<span class="Topic-tags">' }));
    tags.forEach((slug, i) => {
      if (i > 0) out.push(text(" "));
      out.push(...link(slug, `#${slug}`, "Topic-tag"));
    });
    out.push(Object.assign(new Token("html_inline", "", 0), { content: "</span>" }));
  }
  return out;
}

// Every paragraph or list item of a Markdown document that mentions a topic, as
// [{ slug, html }], where `html` is the item rendered as it appears in the post.
export function findMentions(md, source, topics) {
  const tokens = md.parse(source, {});
  const mentions = [];
  tokens.forEach((token, i) => {
    if (!isBody(tokens, i)) return;
    const slugs = slugsIn(token.children, topics);
    if (slugs.size === 0) return;
    const html = md.renderer.renderInline(token.children, md.options, {});
    for (const slug of slugs) mentions.push({ slug, html });
  });
  return mentions;
}
