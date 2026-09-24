import {PRODUCTS} from './products.js';
import './coa.js';
document.querySelector('[data-total-products]').textContent=PRODUCTS.length;
for(const type of ['single','blend','supply'])document.querySelectorAll(`[data-count-type="${type}"]`).forEach(el=>el.textContent=PRODUCTS.filter(p=>p.type===type).length);
const stages=document.querySelector('[data-testing-stages]');
fetch('data/testing.json').then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(rows=>{if(!Array.isArray(rows)||!rows.length)return;stages.innerHTML=rows.map((row,i)=>`<div class="testing-row"><span>${String(i+1).padStart(2,'0')}</span><strong>${row.name}</strong><small>${row.detail||''}</small></div>`).join('')}).catch(()=>{stages.textContent='Testing protocol details could not be loaded.'});
