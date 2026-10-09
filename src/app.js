const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const langButton=$('.language-toggle'),langMenu=$('#languages'),menuButton=$('.menu-toggle'),mobileMenu=$('#mobile-nav');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const ease='cubic-bezier(.22,1,.36,1)';
function toggle(button,menu,open){
 const wasOpen=button.getAttribute('aria-expanded')==='true';
 if(wasOpen===open)return;
 button.setAttribute('aria-expanded',String(open));
 menu.getAnimations().forEach(a=>a.cancel());
 if(reducedMotion.matches){menu.hidden=!open;return;}
 if(open){menu.hidden=false;menu.animate([{opacity:0,transform:'translateY(-7px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:320,easing:ease});}
 else{const a=menu.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:180,easing:'ease-out'});a.onfinish=()=>{if(button.getAttribute('aria-expanded')==='false')menu.hidden=true;};}
}
langButton.addEventListener('click',()=>toggle(langButton,langMenu,langButton.getAttribute('aria-expanded')!=='true'));
menuButton.addEventListener('click',()=>toggle(menuButton,mobileMenu,menuButton.getAttribute('aria-expanded')!=='true'));
document.addEventListener('click',e=>{if(!e.target.closest('.language-picker'))toggle(langButton,langMenu,false);if(e.target.closest('#mobile-nav a'))toggle(menuButton,mobileMenu,false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const b=langButton.getAttribute('aria-expanded')==='true'?langButton:menuButton.getAttribute('aria-expanded')==='true'?menuButton:null;toggle(langButton,langMenu,false);toggle(menuButton,mobileMenu,false);b?.focus();}});
$$('.language-menu a').forEach(a=>a.addEventListener('click',()=>{if(location.hash)a.hash=location.hash}));
let selected=0,currency='AED';
function renderPayment(){const {prices,rate}=window.LOREVIA;const format=n=>(currency==='USD'?'≈ USD ':'AED ')+new Intl.NumberFormat(document.body.dataset.locale,{maximumFractionDigits:0}).format(currency==='USD'?n/rate:n);$('[data-total]').textContent=format(prices[selected]);$$('[data-phase]').forEach(el=>el.textContent=format(prices[selected]*Number(el.dataset.phase)/100));$('[data-monthly]').textContent=format(prices[selected]*.01);if(!reducedMotion.matches)$$('[data-total],[data-phase],[data-monthly]').forEach(el=>el.animate([{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:ease}));$$('[data-unit]').forEach(b=>{let active=Number(b.dataset.unit)===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});$$('[data-currency]').forEach(b=>{let active=b.dataset.currency===currency;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});}
$$('[data-unit]').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.unit);renderPayment()}));
$$('[data-select-unit]').forEach(a=>a.addEventListener('click',()=>{selected=Number(a.dataset.selectUnit);renderPayment()}));
$$('[data-currency]').forEach(b=>b.addEventListener('click',()=>{currency=b.dataset.currency;renderPayment()}));
// Load the official Tally widget near the form, preserving an accessible direct-link fallback.
let tallyLoading=false;
function loadTally(){
 if(window.Tally){window.Tally.loadEmbeds();return;}
 if(tallyLoading)return;tallyLoading=true;
 const s=document.createElement('script');s.src='https://tally.so/widgets/embed.js';
 s.onload=()=>window.Tally?.loadEmbeds();
 s.onerror=()=>$$('iframe[data-tally-src]').forEach(f=>{if(!f.src)f.src=f.dataset.tallySrc;});
 document.body.append(s);
}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loadTally();observer.disconnect()}},{rootMargin:'900px'});observer.observe($('#enquire'));}else loadTally();

// Reveal content on entry, preserving immediate visibility without JavaScript.
const revealTargets=$$('.intro-grid>*,.stats>div,.intro-images>figure,.section-heading>*,.residence-row,.destination-heading>*,.destination-story>*,.amenity-copy>h2,.amenity-copy li,.amenity-visuals figure,.payment-top>*,.calculator-toolbar,.phase,.international>h2,.international-intro,.buy-grid article,.faq>div,.contact-copy>*,.form-card,.footer-top>div');
let revealObserver;
function revealAll(){revealObserver?.disconnect();revealTargets.forEach(el=>{el.getAnimations().forEach(a=>a.finish());el.style.opacity='';el.style.transform='';});}
if(!reducedMotion.matches&&'IntersectionObserver'in window){
 revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;revealObserver.unobserve(el);el.style.opacity='';el.animate([{opacity:0,transform:'translateY(32px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,delay:Number(el.dataset.motionDelay||0),easing:ease});}),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 revealTargets.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.95){el.style.opacity='0';const parent=el.parentElement;if(parent.matches('.stats,.buy-grid,.payment-phases,.amenity-copy ul'))el.dataset.motionDelay=String([...parent.children].indexOf(el)*65);revealObserver.observe(el);}});
 if(scrollY<100){$('.hero-copy')?.animate([{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:0,easing:ease,fill:'backwards'});$('.hero-photo img')?.animate([{transform:'scale(1.065)'},{transform:'scale(1)'}],{duration:1500,easing:ease});$('.hero-bottom')?.animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:120,easing:ease,fill:'backwards'});}
}
reducedMotion.addEventListener('change',event=>{if(event.matches)revealAll();});
// Passive scroll updates are coalesced into one animation frame.
let scheduled=false;const header=$('.site-header'),progress=$('.scroll-progress');
function updateScroll(){const span=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${span>0?Math.min(1,scrollY/span):0})`;header.classList.toggle('is-scrolled',scrollY>20);scheduled=false;}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
// Native details retain keyboard semantics; only their open transition is animated.
$$('.faq-list details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open&&!reducedMotion.matches){const text=$('p',details);text.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:ease});}}));

// Every commercial CTA opens the real Tally form immediately; its href remains a no-JS fallback.
const enquiryDialog=$('#enquiry-dialog');let lastEnquiryTrigger=null;let bodyOverflow='';
if(enquiryDialog){
 const slot=$('.dialog-form-slot',enquiryDialog);
 function prepareDialogForm(){
  if($('iframe',slot))return;
  const source=$('iframe[data-tally-src]');if(!source)return;
  const frame=document.createElement('iframe');frame.title=$('#dialog-title').textContent;frame.width='100%';frame.height='460';frame.loading='eager';frame.dataset.tallySrc=source.dataset.tallySrc;
  frame.addEventListener('load',()=>{$('.form-loading',slot)?.remove()});slot.append(frame);loadTally();
  if(window.Tally)window.Tally.loadEmbeds();
 }
 $$('a[href="#enquire"]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();lastEnquiryTrigger=link;bodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';enquiryDialog.showModal();prepareDialogForm();
  if(!reducedMotion.matches)enquiryDialog.animate([{opacity:0,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:400,easing:ease});
 }));
 $('.dialog-close',enquiryDialog).addEventListener('click',()=>enquiryDialog.close());
 enquiryDialog.addEventListener('click',event=>{if(event.target!==enquiryDialog)return;const r=enquiryDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)enquiryDialog.close();});
 enquiryDialog.addEventListener('close',()=>{document.body.style.overflow=bodyOverflow;lastEnquiryTrigger?.focus({preventScroll:true});});
}
// Keyboard navigation never lands on content temporarily hidden by a reveal.
document.addEventListener('focusin',event=>{revealTargets.filter(el=>el.contains(event.target)).forEach(el=>{revealObserver?.unobserve(el);el.style.opacity='';el.getAnimations().forEach(a=>a.finish());});});
$('.skip')?.addEventListener('click',()=>{const main=$('#main');main.setAttribute('tabindex','-1');main.focus({preventScroll:true});});

$$('[data-retry-form]').forEach(button=>button.addEventListener('click',()=>{const region=button.closest('.enquiry-dialog,.form-card');const frame=$('iframe',region);if(frame){frame.src=frame.dataset.tallySrc;loadTally();}}));
