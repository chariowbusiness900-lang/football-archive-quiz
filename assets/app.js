(()=>{'use strict';
const D=window.QDATA||[],b=document.body,comp=b.dataset.comp,label=b.dataset.label,home=b.dataset.rel||'';
const g=document.getElementById('game');if(!g||!D.length)return;
const surv=comp==='survie',pool=surv?D:D.filter(q=>q.c===comp);
let qs=[],i=0,sc=0,lives=3,done=false;
const sh=a=>{a=[...a];for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a};
const mix=q=>{const k=sh(q.o.map((_,x)=>x));return{...q,o:k.map(x=>q.o[x]),a:k.indexOf(q.a)}};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const key='fa-best-'+comp;
const best=()=>{try{return +localStorage.getItem(key)||0}catch(e){return 0}};
const save=s=>{try{if(s>best())localStorage.setItem(key,s)}catch(e){}};
function intro(){const n=Math.min(10,pool.length);g.innerHTML=`<div class="intro"><span class="tag">${surv?'3 vies':n+' questions'}</span><h2>${surv?'Combien de questions allez-vous enchaîner ?':'Prêt pour le coup d’envoi ?'}</h2><p>${surv?'Trois erreurs et la partie s’arrête.':'L’ordre des réponses change à chaque partie.'}${best()?` Votre record : <strong>${best()}</strong>.`:''}</p><button class="btn" data-a="go">Jouer</button></div>`}
function start(){qs=sh(pool).map(mix);if(!surv)qs=qs.slice(0,10);i=0;sc=0;lives=3;show()}
function show(){if(i>=qs.length)return end(qs.length);const q=qs[i],t=qs.length;done=false;
g.innerHTML=`<div class="top"><span>${esc(label)} · Q${i+1}${surv?'':'/'+t}</span><span class="pts">${sc} pt${sc>1?'s':''}${surv?' · '+'♥'.repeat(lives)+'♡'.repeat(3-lives):''}</span></div><div class="bar"><i style="width:${i/t*100}%"></i></div><p class="q">${esc(q.q)}</p><div class="ans">${q.o.map((o,x)=>`<button class="a" data-x="${x}"><b>${'ABCD'[x]}</b><span>${esc(o)}</span></button>`).join('')}</div><div class="fb" aria-live="polite"></div><div class="nx"><button class="btn" data-a="next" hidden>Suite →</button></div>`}
function pick(x){if(done)return;done=true;const q=qs[i],ok=x===q.a;if(ok)sc++;else if(surv)lives--;
g.querySelectorAll('.a').forEach((e,k)=>{e.disabled=true;if(k===q.a)e.classList.add('ok');else if(k===x)e.classList.add('ko')});
const f=g.querySelector('.fb');f.className='fb '+(ok?'good':'bad');f.innerHTML=`<strong>${ok?'Bonne réponse !':'Raté.'}</strong> ${esc(q.e)}`;
const n=g.querySelector('[data-a=next]');n.hidden=false;n.textContent=(surv&&lives<=0)||i===qs.length-1?'Voir le score →':'Suite →'}
function end(tot){save(sc);const p=Math.round(sc/tot*100),m=p===100?'Sans faute, bravo !':p>=70?'Très solide.':p>=40?'Belle base, rejouez !':'Le prochain match sera le bon.';
const u=encodeURIComponent(`J’ai fait ${sc}/${tot} au quiz foot « ${label} » ⚽ Fais mieux : ${location.href.split('#')[0]}`);
g.innerHTML=`<div class="res"><span class="tag">${esc(label)} terminé</span><div class="big">${sc}<small>/${tot}</small></div><h2>${m}</h2><p>Votre record : <strong>${best()}</strong></p><div class="row"><button class="btn" data-a="go">Rejouer</button><a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/?text=${u}">Partager sur WhatsApp</a><a class="btn alt" href="${home}index.html">Autres quiz</a></div></div>`}
g.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const a=t.dataset.a;if(a==='go')start();else if(a==='next'){if(surv&&lives<=0)end(i+1);else{i++;show()}}else if(t.dataset.x!==undefined)pick(+t.dataset.x)});
intro()})();
