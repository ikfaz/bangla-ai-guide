const { artFor } = require('./editorial-art.cjs');

// Keep the authored dictation illustration on both the article and its cards.
function blogArt(slug, title) {
  if (slug === 'wispr-flow-ai-dictation-bangla-guide') {
    return { src: '/blog/' + slug + '/cover.png', alt: 'মাইক্রোফোনের শব্দতরঙ্গ ল্যাপটপে লেখায় রূপান্তরিত হচ্ছে' };
  }
  return artFor(slug, title);
}
module.exports = { blogArt };
