# Glow Aminos storefront

Static HTML, CSS and JavaScript research catalog. No build step or runtime dependencies. The homepage and shared storefront layout use `assets/css/atelier.css` and `assets/js/` modules; existing owner-supplied AVIF vial assets remain in `assets/images/products/`.

## Run locally

From the repository root:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. Do not use `file://`; the COA and testing data are fetched from local JSON files.

## Catalog

`data/products.json` is the single catalog source. The browser loads it through `assets/js/products.js`; the checkout validation skeleton reads the same JSON on the server. Set its type to `single`, `blend`, or `supply`, provide an owner-authorized image, then add a matching product page under `products/`. Category counts derive from the product records.

Starting prices are display-only until exact variants and size-specific prices are confirmed. Products with `startingPrice` cannot be added to the cart. Only exact-price products are accepted by the server-side validation skeleton in `api/create-checkout.js`. The checkout endpoint is intentionally empty in `assets/js/config.js` so no payment or order success can be simulated.

## Certificates and testing

`data/coa.json` starts as `[]`. Add only owner-supplied records shaped like `{ "product": "...", "lot": "...", "purity": 0, "testDate": "YYYY-MM-DD", "lab": "...", "pdf": "assets/coa/file.pdf" }` and upload the matching PDF. The lot lookup searches this file. `data/testing.json` starts as `[]`; add documented stages shaped like `{ "name": "...", "detail": "..." }`. `data/reviews.json` starts empty; unpublished reviews are not shown.

## Merchant setup

In `assets/js/config.js`, add the confirmed legal entity, site URL, support email, abuse email, billing descriptor, shipping threshold/cutoff, and real form endpoints. No shipping offers, lot claims, or testing badges are shown before supporting data exists. Publish approved shipping, returns, privacy and terms policies before accepting orders.

The static checkout collects contact and shipping details locally for review. It never posts unless `checkoutEndpoint` is configured; payment must be hosted or handled securely server-side. `assets/js/payments.js` marks the integration boundary. Do not put payment credentials in client JavaScript. Existing `api/` functions only validate or reject requests; they do not process payment.

## Deploy

Upload the repository root to GitHub Pages or another static host. Configure a production URL before adding canonical URLs or populating `sitemap.xml`. The repo contains no build step. Review the site on real mobile and desktop browsers before publishing new claims or enabling checkout.
