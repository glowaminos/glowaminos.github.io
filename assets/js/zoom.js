// The same photo powers the hover detail and the full-screen inspection view.
export function setupProductZoom(trigger,source,name){
 if(!trigger)return;
 const hoverSupported=matchMedia('(hover: hover) and (pointer: fine)').matches;
 if(hoverSupported){
  trigger.addEventListener('pointermove',event=>{
   const box=trigger.getBoundingClientRect();
   trigger.style.setProperty('--zoom-x',`${(event.clientX-box.left)/box.width*100}%`);
   trigger.style.setProperty('--zoom-y',`${(event.clientY-box.top)/box.height*100}%`);
  });
  trigger.addEventListener('pointerleave',()=>{
   trigger.style.removeProperty('--zoom-x');trigger.style.removeProperty('--zoom-y');
  });
 }
 trigger.addEventListener('click',()=>{
  const modal=document.createElement('div');modal.className='product-zoom-modal';
  modal.innerHTML=`<div class="product-zoom-dialog" role="dialog" aria-modal="true" aria-label="Zoomed image of ${name}"><div class="product-zoom-toolbar"><span>${name}</span><div><button type="button" data-zoom-out aria-label="Zoom out">−</button><span data-zoom-level aria-live="polite">100%</span><button type="button" data-zoom-in aria-label="Zoom in">+</button><button type="button" data-zoom-close aria-label="Close zoom">×</button></div></div><div class="product-zoom-stage" data-zoom-stage><img src="${source}" alt="Enlarged ${name} product vial" width="1254" height="1254" draggable="false"></div><p class="product-zoom-help">Use + or − to zoom. Drag the image to inspect details. Press Esc to close.</p></div>`;
  document.body.append(modal);document.body.classList.add('locked');
  const dialog=modal.querySelector('[role="dialog"]'),stage=modal.querySelector('[data-zoom-stage]'),img=stage.querySelector('img'),level=modal.querySelector('[data-zoom-level]');
  let zoom=1,offsetX=0,offsetY=0,drag=null;
  const clamp=()=>{const bounds=stage.getBoundingClientRect(),visible=Math.min(bounds.width,bounds.height)*.88,limit=Math.max(0,(visible*zoom-bounds.width)/2+40);offsetX=Math.max(-limit,Math.min(limit,offsetX));offsetY=Math.max(-limit,Math.min(limit,offsetY))};
  const paint=()=>{clamp();img.style.transform=`translate(${offsetX}px,${offsetY}px) scale(${zoom})`;level.textContent=`${Math.round(zoom*100)}%`;stage.classList.toggle('is-zoomed',zoom>1)};
  const setZoom=value=>{zoom=Math.max(1,Math.min(3,value));if(zoom===1)offsetX=offsetY=0;paint()};
  const close=()=>{document.removeEventListener('keydown',keys);modal.remove();document.body.classList.remove('locked');trigger.focus()};
  modal.querySelector('[data-zoom-close]').onclick=close;modal.querySelector('[data-zoom-in]').onclick=()=>setZoom(zoom+.5);modal.querySelector('[data-zoom-out]').onclick=()=>setZoom(zoom-.5);
  modal.addEventListener('click',event=>{if(event.target===modal)close()});
  stage.addEventListener('wheel',event=>{event.preventDefault();setZoom(zoom+(event.deltaY<0?.25:-.25))},{passive:false});
  stage.addEventListener('pointerdown',event=>{if(zoom<=1)return;drag={x:event.clientX,y:event.clientY,ox:offsetX,oy:offsetY};stage.setPointerCapture(event.pointerId)});
  stage.addEventListener('pointermove',event=>{if(!drag)return;offsetX=drag.ox+event.clientX-drag.x;offsetY=drag.oy+event.clientY-drag.y;paint()});
  stage.addEventListener('pointerup',()=>drag=null);stage.addEventListener('pointercancel',()=>drag=null);
  function keys(event){if(event.key==='Escape')close();else if(event.key==='+'||event.key==='=')setZoom(zoom+.5);else if(event.key==='-')setZoom(zoom-.5);else if(event.key==='0')setZoom(1);else if(event.key==='Tab'){const controls=[...dialog.querySelectorAll('button')],first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}}
  document.addEventListener('keydown',keys);modal.querySelector('[data-zoom-close]').focus();paint();
 });
}
