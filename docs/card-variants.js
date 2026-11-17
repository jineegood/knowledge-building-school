const {cards,styles}=window.CARD_VARIANTS;
const gallery=document.querySelector('#gallery');
const note=document.querySelector('#set-note');
const dialog=document.querySelector('#detail');
let version=['A','B','C','D'].includes(location.hash.slice(1))?location.hash.slice(1):'all';
let currentCard=0,currentVersion='B';
function imagePath(card,v){return v==='A'?`art/cards/simple-preview-v3/${card.id.toLowerCase()}.webp`:`art/cards/variants-v4/${v.toLowerCase()}/${card.id.toLowerCase()}.webp`;}
function tile(card,v,index){return `<button class="tile" type="button" data-card="${index}" data-version="${v}" aria-label="${card.name} · ${v} ${styles[v].name} 확대"><img src="${imagePath(card,v)}" alt="${card.name} ${v} 시안" loading="lazy" width="750" height="500"><span class="tile-caption"><b class="version-badge version-${v}">${v}</b><span>${version==='all'?styles[v].name:card.name}</span><small>확대 ↗</small></span></button>`;}
function render(){
 document.querySelectorAll('[data-set]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.set===version)));
 note.innerHTML=version==='all'?'<strong>A · B · C · D</strong><span>같은 카드끼리 네 가지 화풍을 비교합니다. 그림을 누르면 크게 볼 수 있어요.</span>':`<strong>${version} · ${styles[version].name}</strong><span>${styles[version].desc} · 10장</span>`;
 gallery.innerHTML=version==='all'?cards.map((card,i)=>`<section class="card-row"><h2>${String(i+1).padStart(2,'0')}. ${card.name}<small>${card.type} · 비용 ${card.cost}</small></h2><div class="row-grid">${['A','B','C','D'].map(v=>tile(card,v,i)).join('')}</div></section>`).join(''):`<section class="set-grid">${cards.map((card,i)=>tile(card,version,i)).join('')}</section>`;
 gallery.querySelectorAll('.tile').forEach(b=>b.addEventListener('click',()=>{currentCard=Number(b.dataset.card);currentVersion=b.dataset.version;renderDetail();dialog.showModal();}));
}
function renderDetail(){const card=cards[currentCard];document.querySelector('#detail-title').textContent=`${card.name} · ${currentVersion} ${styles[currentVersion].name}`;const img=document.querySelector('#detail-image');img.src=imagePath(card,currentVersion);img.alt=`${card.name} ${currentVersion} 확대`;document.querySelector('#download').href=img.src;document.querySelector('#download').download=`${currentVersion}-${card.id.toLowerCase()}.webp`;dialog.querySelectorAll('[data-detail-version]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.detailVersion===currentVersion)));}
document.querySelectorAll('[data-set]').forEach(b=>b.addEventListener('click',()=>{version=b.dataset.set;history.replaceState(null,'',version==='all'?location.pathname:'#'+version);render();}));
document.querySelector('#compact').addEventListener('change',e=>gallery.classList.toggle('compact',e.target.checked));
document.querySelector('#close-detail').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.querySelectorAll('[data-detail-version]').forEach(b=>b.addEventListener('click',()=>{currentVersion=b.dataset.detailVersion;renderDetail();}));
function stepCard(delta){currentCard=(currentCard+delta+cards.length)%cards.length;renderDetail();}
document.querySelector('#previous-card').addEventListener('click',()=>stepCard(-1));
document.querySelector('#next-card').addEventListener('click',()=>stepCard(1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stepCard(e.key==='ArrowLeft'?-1:1);}});
render();
