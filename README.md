# Glow Aminos storefront

Static HTML, CSS and JavaScript research catalog. No build step or runtime dependencies. The homepage and shared storefront layout use `assets/css/atelier.css` and `assets/js/` modules; existing owner-supplied AVIF vial assets remain in `assets/images/products/`.

The catalog also includes enhanced 1254 × 1254 WebP versions under `assets/images/products/hires/`. Product cards use responsive `srcset`, the homepage hero uses the larger files, and individual product pages use them for pointer hover and an accessible click-to-zoom gallery. Keep the original AVIF files and update both versions when replacing a product image.

## Run locally

From the repository root:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. Do not use `file://`; the COA and testing data are fetched from local JSON files.

## Catalog

`data/products.json` is the single catalog source. The browser loads it through `assets/js/products.js`; the checkout validation skeleton reads the same JSON on the server. Set its type to `single`, `blend`, or `supply`, provide an owner-authorized image, then add a matching product page under `products/`. Category counts derive from the product records.

Products with `startingPrice` can be added to the cart with an estimated subtotal, but checkout still requires confirmed variants and size-specific prices. The server-side validation skeleton in `api/create-checkout.js` accepts only exact-price products. The checkout endpoint is intentionally empty in `assets/js/config.js` so no payment or order success can be simulated.

## Certificates and testing

`data/coa.json` starts as `[]`. Add only owner-supplied records shaped like `{ "product": "...", "lot": "...", "purity": 0, "testDate": "YYYY-MM-DD", "lab": "...", "pdf": "assets/coa/file.pdf" }` and upload the matching PDF. The lot lookup searches this file. `data/testing.json` starts as `[]`; add documented stages shaped like `{ "name": "...", "detail": "..." }`. `data/reviews.json` starts empty; unpublished reviews are not shown.

## Merchant setup

In `assets/js/config.js`, add the confirmed legal entity, site URL, support email, abuse email, billing descriptor, shipping threshold/cutoff, and real form endpoints. A flat $10 shipping fee per non-empty order is set in `SITE_CONFIG.flatShippingRate` and included in the cart, checkout and server validation total. No free-shipping offers, lot claims, or testing badges are shown before supporting data exists. Publish approved shipping, returns, privacy and terms policies before accepting orders.

The static checkout collects contact and shipping details locally for review. It never posts unless `checkoutEndpoint` is configured; payment must be hosted or handled securely server-side. `assets/js/payments.js` marks the integration boundary. Do not put payment credentials in client JavaScript. Existing `api/` functions only validate or reject requests; they do not process payment.

## Deploy

Upload the repository root to GitHub Pages or another static host. Configure a production URL before adding canonical URLs or populating `sitemap.xml`. The repo contains no build step. Review the site on real mobile and desktop browsers before publishing new claims or enabling checkout.

## Product details

Every item has an original overview and a compound-level specification summary in `data/products.json`; product pages show a COA availability state and links to the site's shipping and returns information. The source trail and items that require merchant confirmation are in `docs/product-content-sources.md`. Compound identity information is distinct from a Glow Aminos lot's measured purity or a verified formulation. Do not transfer another seller's certificates or commercial policies into this catalog.
