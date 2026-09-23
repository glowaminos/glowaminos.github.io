const KEY='researchAccess:v1';
const DAY=86400000;
export function setupAgeGate(){
 try{if(Date.now()-Number(localStorage.getItem(KEY))<30*DAY)return}catch{}
 const last=document.activeElement;
 const layer=document.createElement('div');layer.className='age-gate';layer.innerHTML=`<div class="age-gate__panel" role="dialog" aria-modal="true" aria-labelledby="gate-title" tabindex="-1"><div class="age-gate__mark">RESEARCH ACCESS / 21+</div><h2 id="gate-title">For the laboratory,<br><em>and nowhere else.</em></h2><p>Confirm both statements to enter the catalog.</p><label><input type="checkbox" data-gate-check> I am at least 21 years of age.</label><label><input type="checkbox" data-gate-check> I am purchasing for in-vitro or laboratory research only, not for human or veterinary use.</label><button type="button" class="btn" data-gate-enter disabled>Enter site</button><a href="https://www.google.com/" class="age-gate__exit">Not a researcher? Exit site</a></div>`;
 document.body.append(layer);document.body.classList.add('locked');
 const panel=layer.querySelector('[role="dialog"]'),checks=[...layer.querySelectorAll('[data-gate-check]')],enter=layer.querySelector('[data-gate-enter]');
 checks.forEach(c=>c.addEventListener('change',()=>enter.disabled=!checks.every(x=>x.checked)));
 const trap=e=>{if(e.key!=='Tab')return;const list=[...panel.querySelectorAll('input,button:not([disabled]),a')],first=list[0],end=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}};
 panel.addEventListener('keydown',trap);checks[0].focus();
 enter.onclick=()=>{if(enter.disabled)return;try{localStorage.setItem(KEY,String(Date.now()))}catch{}layer.remove();document.body.classList.remove('locked');last?.focus?.()};
}
