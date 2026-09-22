import {injectChrome,setupMenu,setupAccordion,setupAck,injectCanonical,productCard} from './components.js';
import {setupCart} from './cart.js';import {PRODUCTS} from './products.js';
injectChrome();setupMenu();setupAccordion();setupAck();injectCanonical();setupCart();
const f=document.querySelector('[data-featured-products]');if(f)f.innerHTML=PRODUCTS.filter(p=>p.featured).map(productCard).join('');
