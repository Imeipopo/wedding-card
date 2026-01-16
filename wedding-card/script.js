document.addEventListener('DOMContentLoaded', function(){
  const openBtn = document.getElementById('openBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpMsg = document.getElementById('rsvpMsg');

  openBtn.addEventListener('click', function(){
    // 開啟信封後先顯示幻燈片，播放完或按確定再顯示請帖與 RSVP
    document.body.classList.add('opened');
    // 先顯示時間軸（人生軌跡）讓使用者往下滑
    const timeline = document.querySelector('.timeline');
    timeline.setAttribute('aria-hidden','false');
    // scroll to top to ensure first item visible
    const inner = timeline.querySelector('.timeline-inner');
    if(inner) inner.scrollTop = 0;
  });

  rsvpForm.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(rsvpForm);
    const name = data.get('name').trim();
    const attend = data.get('attend');
    if(!name){ rsvpMsg.textContent = '請輸入姓名。'; return; }
    rsvpMsg.textContent = `已收到 ${name} 的回覆：${attend === 'yes' ? '會參加' : '無法參加'}，感謝！`;
    rsvpForm.reset();
  });
});

// 幻燈片邏輯
function startSlideshow(){
  const slidesEl = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.querySelector('.slide-dots');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');
  const slideshow = document.querySelector('.slideshow');
  let index = 0; let timer = null; const interval = 3500;

  // build dots
  dotsWrap.innerHTML = '';
  slides.forEach((s,i)=>{ const b=document.createElement('button'); if(i===0) b.classList.add('active'); b.addEventListener('click',()=> goTo(i)); dotsWrap.appendChild(b); });

  function update(){
    slidesEl.style.transform = `translateX(-${index*100}%)`;
    const dots = dotsWrap.querySelectorAll('button'); dots.forEach((d,i)=> d.classList.toggle('active', i===index));
    const current = slides[index];
    if(current && current.dataset.type === 'final'){
      // 到最後一張就停止自動播放，短暫停留後結束幻燈片並顯示請帖
      stopTimer();
      setTimeout(()=>{
        slideshow.setAttribute('aria-hidden','true');
        const inv = document.querySelector('.invitation');
        inv.setAttribute('aria-hidden','false');
        const h = inv.querySelector('h2'); if(h) h.focus();
      }, 900);
    }
  }

  function goTo(i){ index = (i+slides.length) % slides.length; update(); }
  function next(){ index = (index+1) % slides.length; update(); }
  function prev(){ index = (index-1+slides.length) % slides.length; update(); }

  function startTimer(){ stopTimer(); timer = setInterval(()=>{ const curr = slides[index]; if(curr.dataset.type==='final'){ stopTimer(); } else { next(); } }, interval); }
  function stopTimer(){ if(timer){ clearInterval(timer); timer = null; } }

  prevBtn.addEventListener('click', ()=>{ prev(); });
  nextBtn.addEventListener('click', ()=>{ next(); });

  // 不使用按鈕結束：當自動或手動到達最後一張時，update() 會處理結束流程

  // start
  update(); startTimer();
}

// timeline -> 當使用者按前往幻燈片或滑到底時切換
document.addEventListener('DOMContentLoaded', ()=>{
  const toSlideshow = document.getElementById('toSlideshow');
  const timeline = document.querySelector('.timeline');
  const slideshow = document.querySelector('.slideshow');
  if(toSlideshow){ toSlideshow.addEventListener('click', ()=>{
    timeline.setAttribute('aria-hidden','true');
    slideshow.setAttribute('aria-hidden','false');
    startSlideshow();
  }); }

  // 若使用者手動滑到最後一項，也自動顯示前往幻燈片按鈕（保險檢查）
  const inner = timeline && timeline.querySelector('.timeline-inner');
  if(inner){ inner.addEventListener('scroll', ()=>{
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 8;
    const toBtn = document.getElementById('toSlideshow');
    if(atBottom && toBtn){ toBtn.classList.add('visible'); }
  }); }
});
