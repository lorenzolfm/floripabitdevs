# Floripa BitDevs

Simple [Eleventy](https://www.11ty.dev/) site for hosting all of the links from meetups past and future.

## Development

You'll need [Node.js](https://nodejs.org/) 24 to run the site locally. Once it's set up:

* Clone the repository and go into the directory
* Run `npm install`
* Run `npm start` (or `make preview`)
* Go to http://localhost:8080

`npm run build` (or `make build`) writes the site to `_site/`. Pushing to `master`
deploys it to GitHub Pages through `.github/workflows/pages.yml`.

## Making a Post

To make a new post, make a new file in `_posts/` with a title of
`YYYY-MM-DD-title-goes-here.md`. At the top of the file you'll want to provide the
following information:

```md
---
type: socratic # or whitepaper for a whitepaper series
title: "Name of the Post"
meetup: https://www.meetup.com/clube-bitcoin-floripa/events/[event id here]/
---
```

After that, it's just simple markdown ([CommonMark](https://commonmark.org/help/)).
Stick to one bullet marker (`*` or `-`) per list, since switching markers starts a
new list. The site will auto-generate the rest.

## Topics

`/topics/` is a knowledge base in the spirit of [Optech's topics](https://bitcoinops.org/en/topics/).
Each topic is a file in `_topics/` whose name is the topic's URL (`_topics/silent-payments.md`
is `/topics/silent-payments`):

```md
---
title: "Silent Payments (BIP352)"
categories: ["Carteiras", "Privacidade"]
aliases: ["silent payment", "BIP 352", "Silentium"]
case_sensitive_aliases: ["SP"] # optional, for words that are ambiguous in lowercase
see_also: ["light-clients", "payjoin"] # optional, other topic file names
---

A short description of the topic.
```

Posts are never tagged by hand. Wherever an alias appears in a post, the post links to the topic
and the topic page lists that item, so a new post shows up on its topics with no extra work. A
topic named inside a link gets a `#tag` after the item, since links can't nest.

Aliases match case-insensitively on whole words. Spaces and hyphens in an alias match a space, a
hyphen or nothing (`BIP 324` matches `BIP324` and `BIP-324`), and aliases ending in a letter also
match their plural. When aliases overlap the longest wins, so `Taproot Asset` doesn't also count
as `Taproot`. Headings are ignored.

To check a new alias, run `npm start` and look at the topic page: it lists every item that matched.

## Changing Site Data

The site title, description, URL and menu live in `_data/site.json`.

## Attributions

Thanks to [LeNPaul](https://github.com/LeNPaul/jekyll-starter-kit) for the
Jekyll starter kit this was originally forked from.
