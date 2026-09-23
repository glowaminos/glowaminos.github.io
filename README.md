# Research Catalog storefront

Vanilla HTML/CSS/JavaScript ecommerce storefront built from the supplied production brief.

## Implemented
- 13 catalog products from the verified source set.
- Working search, filters, sorting, product pages, quantity controls, cart drawer, persistent cart, cart page, checkout form, research-use acknowledgement, responsive navigation and FAQ accordions.
- Server-side checkout validation skeleton that recalculates totals from product IDs rather than trusting browser totals.
- Unique page titles/descriptions and canonical injection only when a real production domain is configured.

## Intentionally not fabricated
- Brand/company identity beyond the neutral `Research Catalog` label.
- Unverified product variants, purity values, lot numbers, COAs, labs, reviews, order counts, stock counts, shipping claims or medical claims.
- Payment success.
- Competitor product photography or hotlinked images.

## Run locally
```bash
python -m http.server 8080
```
Open `http://localhost:8080/`.

## Before production
1. Update `assets/js/config.js` with the real brand/domain/endpoints.
2. Add merchant-authorized product images.
3. Verify current variants/pricing again.
4. Connect real COAs and quality documentation.
5. Add real shipping/returns/legal policies.
6. Connect a real server-side payment provider in `api/create-checkout.js`.
7. Configure contact/newsletter endpoints.
8. Populate `sitemap.xml` after the production domain is known.


## Product image update
- 13 owner-supplied AVIF product images are stored in `assets/images/products/`.
- Every catalog product now has a matching real product image.
- Product cards, featured products, product detail pages, cart thumbnails and the homepage hero use these supplied assets.
- Original random/hash filenames were replaced with semantic product filenames.
