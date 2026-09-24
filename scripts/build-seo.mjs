import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {SITE_CONFIG} from '../assets/js/config.js';

const base=`${SITE_CONFIG.siteUrl.replace(/\/$/,'')}/`;
const products=JSON.parse(await readFile('data/products.json','utf8'));
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=value=>`$${Number(value).toFixed(2)}`;
const structured=value=>JSON.stringify(value).replace(/</g,'\\u003c');
async function edit(file,transform){const original=await readFile(file,'utf8');const revised=transform(original);if(revised!==original)await writeFile(file,revised)}
function setCanonical(html,url){
 const tag=`<link rel="canonical" href="${url}">`;
 html=/<link rel="canonical"[^>]*>/.test(html)?html.replace(/<link rel="canonical"[^>]*>/,tag):html.replace('</head>',`${tag}</head>`);
 const social=`<meta property="og:url" content="${url}">`;
 return /<meta property="og:url"[^>]*>/.test(html)?html.replace(/<meta property="og:url"[^>]*>/,social):html.replace('</head>',`${social}</head>`);
}
function setSocialImage(html,url,alt){
 const image=`<meta property="og:image" content="${url}"><meta property="og:image:alt" content="${escape(alt)}">`;
 return /<meta property="og:image"[^>]*><meta property="og:image:alt"[^>]*>/.test(html)?html.replace(/<meta property="og:image"[^>]*><meta property="og:image:alt"[^>]*>/,image):html.replace('</head>',`${image}</head>`);
}
function setJsonLd(html,graph){
 const tag=`<script type="application/ld+json" data-seo-structured>${structured(graph)}</script>`;
 return /<script type="application\/ld\+json" data-seo-structured>[^<]*<\/script>/.test(html)?html.replace(/<script type="application\/ld\+json" data-seo-structured>[^<]*<\/script>/,tag):html.replace('</head>',`${tag}</head>`);
}
function fallbackProduct(p){
 const items=[['Catalog category',p.category],['Compound class',p.compoundClass],['Listed strength',p.listedStrength],['CAS number',p.casNumber],['Molecular formula',p.molecularFormula],['Molecular weight',p.molecularWeight],['Sequence',p.sequence]].filter(([,v])=>v!=null);
 const price=p.startingPrice!=null?`From ${money(p.startingPrice)}`:money(p.salePrice??p.regularPrice);
 return `<div class="container product-detail" data-product-detail><!-- SEO_PRODUCT_START --><div class="product-gallery"><div class="product-visual has-image product-detail-image"><img class="product-image detail-image" src="../assets/images/products/hires/${escape(p.slug)}.webp" alt="${escape(p.name)} product vial" width="1254" height="1254"></div></div><div class="product-info"><p class="kicker">${p.type==='blend'?'RESEARCH BLEND':p.type==='supply'?'LAB SUPPLY':'SINGLE PEPTIDE'} / PRODUCT</p><h1 class="title">${escape(p.name)}</h1><div class="product-info__price"><span class="price">${price}</span></div><p class="product-info__intro">${escape(p.overview)}</p><div class="product-use-notice">FOR LABORATORY RESEARCH USE ONLY. NOT FOR HUMAN OR VETERINARY USE.</div><div class="product-data"><details open><summary>Product overview</summary><p>${escape(p.overview)}</p>${p.researchContext?`<p>${escape(p.researchContext)}</p>`:''}</details><details><summary>Product specifications</summary><dl>${items.map(([key,value])=>`<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><p>${escape(p.specificationNote)}</p></details><details><summary>Certificate of analysis (COA)</summary><p>No Glow Aminos batch-specific COA has been provided for this product. Check the <a href="../coa.html">COA library</a> for published documents.</p></details><details><summary>Shipping &amp; returns</summary><p>Shipping is a flat $10 per order. See <a href="../shipping.html">shipping information</a> and <a href="../returns.html">returns &amp; refunds</a> for current details.</p></details></div></div><!-- SEO_PRODUCT_END --></div>`;
}
for(const p of products){
 const path=join('products',`${p.slug}.html`),url=`${base}products/${p.slug}.html`;
 await edit(path,html=>{
  const fallback=fallbackProduct(p);
  html=html.includes('<!-- SEO_PRODUCT_START -->')?html.replace(/<div class="container product-detail" data-product-detail><!-- SEO_PRODUCT_START -->[\s\S]*?<!-- SEO_PRODUCT_END --><\/div>/,fallback):html.replace('<div class="container product-detail" data-product-detail></div>',fallback);
  if(!html.includes('<!-- SEO_PRODUCT_START -->'))throw Error(`Missing product fallback: ${p.slug}`);
  html=setCanonical(html,url);
  html=setSocialImage(html,`${base}assets/images/products/hires/${p.slug}.webp`,`${p.name} product vial`);
  const product={'@type':'Product','@id':`${url}#product`,name:p.name,description:p.overview,url,image:`${base}assets/images/products/hires/${p.slug}.webp`};
  const price=p.salePrice??p.regularPrice;
  if(p.startingPrice==null&&price!=null)product.offers={'@type':'Offer',url,priceCurrency:'USD',price};
  const breadcrumb={'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Glow Aminos',item:base},{'@type':'ListItem',position:2,name:'Research catalog',item:`${base}shop.html`},{'@type':'ListItem',position:3,name:p.name,item:url}]};
  return setJsonLd(html,{'@context':'https://schema.org','@graph':[product,breadcrumb]});
 });
}
const card=p=>`<article class="product-card"><a class="product-visual has-image" href="products/${escape(p.slug)}.html"><img class="product-image" src="${escape(p.image)}" alt="${escape(p.name)} product vial" width="384" height="384" loading="lazy"></a><div class="product-body"><a class="product-name" href="products/${escape(p.slug)}.html">${escape(p.name)}</a><div class="product-card__bottom"><span class="price">${p.startingPrice!=null?'From ':''}${money(p.salePrice??p.startingPrice??p.regularPrice)}</span><span class="product-card__note">Research use only</span></div></div></article>`;
for(const [file,attribute,items] of [['index.html','data-featured-products',products.filter(p=>p.featured)],['shop.html','data-shop-grid',products]]){
 await edit(file,html=>{
  const block=`<div class="product-grid" ${attribute}><!-- SEO_GRID_START -->${items.map(card).join('')}<!-- SEO_GRID_END --></div>`;
  const re=new RegExp(`<div class="product-grid" ${attribute}><!-- SEO_GRID_START -->[\\s\\S]*?<!-- SEO_GRID_END --><\\/div>`);
  html=re.test(html)?html.replace(re,block):html.replace(`<div class="product-grid" ${attribute}></div>`,block);
  if(!html.includes(`<!-- SEO_GRID_START -->`))throw Error(`Missing catalog fallback: ${file}`);
  html=setCanonical(html,file==='index.html'?base:`${base}${file}`);
  if(file==='index.html'){
   html=setSocialImage(html,`${base}assets/images/glow-aminos-logo.webp`,'Glow Aminos logo');
   html=setJsonLd(html,{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':`${base}#organization`,name:'Glow Aminos',url:base,logo:`${base}assets/images/glow-aminos-logo.webp`},{'@type':'WebSite','@id':`${base}#website`,name:'Glow Aminos',url:base,publisher:{'@id':`${base}#organization`}}]});
  }
  return html;
 });
}
const pages=['about.html','contact.html','faq.html','quality.html','coa.html','shipping.html','returns.html','disclaimer.html','research-use-only.html','privacy.html','terms.html'];
for(const file of pages)await edit(file,html=>setCanonical(html,`${base}${file}`));
const urls=['','shop.html',...pages,...products.map(p=>`products/${p.slug}.html`)];
await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${base}${url}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);
console.log(`Generated ${products.length} crawlable product pages and ${urls.length} sitemap URLs.`);
