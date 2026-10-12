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

## Changing Site Data

The site title, description, URL and menu live in `_data/site.json`.

## Attributions

Thanks to [LeNPaul](https://github.com/LeNPaul/jekyll-starter-kit) for the
Jekyll starter kit this was originally forked from.
