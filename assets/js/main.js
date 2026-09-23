import './seo.js';
import {injectChrome,setupMenu,setupAccordion,injectCanonical,productCard} from './components.js';
import {setupCart} from './cart.js';
import {PRODUCTS,catalogError} from './products.js';
import {setupAgeGate} from './age-gate.js';
import {setupSearch} from './search.js';
injectChrome();setupMenu();setupAccordion();injectCanonical();setupCart();setupSearch();setupAgeGate();
const featured=document.querySelector('[data-featured-products]');if(featured)featured.innerHTML=catalogError?'<div class="empty-state">The catalog could not be loaded. <button class="btn secondary" onclick="location.reload()">Retry</button></div>':PRODUCTS.filter(p=>p.featured).map(productCard).join('');
const header=document.querySelector('[data-header]');const updateHeader=()=>header?.classList.toggle('scrolled',scrollY>40);addEventListener('scroll',updateHeader,{passive:true});updateHeader();
