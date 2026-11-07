# News sitemap dates

`scripts/generate-news-sitemap.cjs` uses the original `datePublished` from an
Article, NewsArticle or BlogPosting JSON-LD block. It does not substitute edits,
Git history, filesystem dates or a scheduled publishing hour for that value.
Invalid or missing publication dates and titles are excluded. The existing
article schema classification is preserved; this generator is not an editorial
assessment of news eligibility or a promise of Google News inclusion.

The current build time controls a rolling 48-hour window. Future articles and
articles at least 48 hours old are excluded. There is no fallback to older
articles when the window is empty. Timestamps retain their original offset and
precision. A date without a time remains date-only in XML; UTC midnight is used
only for its age calculation, so an article with unknown publication time can
expire earlier than one with an explicit timestamp. Supply a verified original
timestamp in article metadata when that precision is known.

The regular sitemap continues to list older articles. The News sitemap is
regenerated during the build; deployed entries age out only after another build
and publication. This change does not install a scheduler or submit data to
Search Console. The existing hourly continuation can check for stale output.

Google permits an empty News sitemap and asks for original publication dates and
articles created within the last two days:
https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

Run `node scripts/test-news-sitemap.cjs` for offline coverage of date boundaries,
original versus modified dates, invalid/future/missing values, schema graphs,
empty output, XML escaping and the 1000-item limit. Tests inject a fixed clock;
normal builds use the current clock.
