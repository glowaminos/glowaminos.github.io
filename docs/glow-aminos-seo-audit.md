# Glow Aminos branded search audit

Research date: September 24, 2026. Target query: **Glow Aminos**. Selected public storefront: **https://glowaminos.github.io/**, confirmed with the site owner. This repository is a different deployment from `glowaminos.com`; ownership or migration between those domains is not established in the repository.

## Observed search and site state

- Live samples for “Glow Aminos”, “Glow Aminos research peptides”, “Glow Aminos COA”, “Glow Aminos shipping”, and “Glow Aminos reviews” surfaced a login landing page at [glowaminos.com](https://glowaminos.com/landing-page/), a [Glow Peptides comparison page](https://glowpeptides.com/blog/glow-peptides-and-glow-aminos-compared), [Trustpilot reviews of glowaminos.com](https://www.trustpilot.com/review/glowaminos.com), and coupon/aggregator listings. A separate `glowaminosusa.com` result also appeared for a related query. None of those websites or reviews can be assumed to represent this GitHub storefront. Search results vary by location, personalization and time; the sample is not a rank report.
- `https://glowaminos.github.io/`, its existing `robots.txt`, `sitemap.xml`, and `/products/ghk-cu.html` responded with HTTP 200 during the audit. The published sitemap contained no URLs. This does **not** establish that the pages are indexed or ranking.
- Previously, the product page HTML contained an empty `data-product-detail` container; the overview and product schema were generated only after JavaScript fetched catalog JSON. Google renders many JavaScript pages, but indexing may be delayed or affected if resources fail. The storefront now includes product copy and product links in the initial HTML, then enhances them with JavaScript.
- The configured production URL was empty, so the previous canonical helper produced no canonical links. The new sitemap and canonical URLs use the owner-selected GitHub Pages hostname.
- `data/coa.json` is empty and merchant contact, legal entity and social accounts are not verified in the repo. The SEO markup does not include fabricated reviews, ratings, tests, availability, location, contact details, or social profile links.

## Changes made

| Area | Change | Purpose |
| --- | --- | --- |
| Brand homepage | Put “Glow Aminos” at the start of the title and H1; explain the catalog and answer brand, COA and shipping questions in visible copy | Make the brand and purpose clear to readers and crawlers |
| Product pages | Generate accessible product descriptions, facts, links and disclosure from `data/products.json` into initial HTML | Make 13 product pages understandable without client rendering |
| Catalog links | Include featured products on the homepage and all 13 products on the shop page in source HTML | Give crawlers plain HTML links to every item |
| Canonicals and social metadata | Write self-referencing canonicals and `og:url` on 26 indexable pages; add brand/product images where relevant | Declare the selected page URLs consistently |
| XML sitemap and robots | List 26 public indexable URLs and link the sitemap from `robots.txt` | Supply a usable discovery file |
| Structured data | Add conservative Organization and WebSite graph to the homepage, and Product plus BreadcrumbList on each product page | Describe the entity and page relationships with visible, verified data |
| Index control | Mark cart and 404 pages `noindex`; checkout was already `noindex` | Keep transactional and error pages out of the sitemap and intended index |
| FAQ accuracy | Correct the starting-price answer to match the current cart behavior and state the $10 shipping charge | Prevent contradictory answers |

The static product `Offer` is emitted only for products with an exact listed price. Starting prices remain plain visible text until variants are verified. No availability, star rating, or merchant return policy is represented as structured data. FAQ answers are visible content, without a promise of FAQ rich results.

## Verification and next steps

1. Rebuild generated metadata after catalog edits: `node scripts/build-seo.mjs`. Deploy from the repository root and check that the generated `sitemap.xml`, canonicals, and page source appear on the public host.
2. Verify `https://glowaminos.github.io/` as a property in **Google Search Console**, then submit `https://glowaminos.github.io/sitemap.xml`. Inspect the homepage and sample product URLs. Search Console indexing and performance data are needed to measure a real outcome; access was not provided for this task.
3. Use Google's Rich Results Test on a priced product and an item with a starting price. Structured data eligibility is not a guarantee of a rich result.
4. Decide whether `glowaminos.com` and its separate login website are controlled by the same business. Only after owner verification should canonical, redirect, or `sameAs` relationships be considered. Do not claim the `.com` Trustpilot reviews or legal identity for this deployment without evidence.
5. Publish Glow Aminos lot-specific COAs, verified product variants and approved merchant policies as they become available. Update product pages and structured data only from those records.

## Primary guidance used

- [Google Search Central: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google Search Central: build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search Central: Product snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
