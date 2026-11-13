(function(){
  const WA='6285257530075';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.documentElement;

  // WhatsApp links
  $$('[data-wa]').forEach(a=>{a.href=`https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa)}`;a.target='_blank';a.rel='noopener';});

  // Header: solid setelah di-scroll
  const nav=$('.nav');
  const onScroll=()=>{ if(nav) nav.classList.toggle('solid', scrollY>40); };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Menu mobile
  const burger=$('.burger'), drawer=$('.drawer');
  if(burger&&drawer){
    const set=o=>{drawer.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));};
    burger.addEventListener('click',()=>set(!drawer.classList.contains('open')));
    $$('a',drawer).forEach(a=>a.addEventListener('click',()=>set(false)));
    addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  }

  // Filter + lightbox portofolio
  const figs=$$('.pf figure');
  if(figs.length){
    const chips=$$('.filters button');
    chips.forEach(b=>b.addEventListener('click',()=>{
      chips.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
      figs.forEach(f=>f.hidden=!(b.dataset.cat==='all'||f.dataset.cat===b.dataset.cat));
    }));
    const lb=$('#lb'), img=$('#lbImg'), cap=$('#lbCap'); let list=[], idx=0, last=null;
    const show=i=>{list=figs.filter(f=>!f.hidden); idx=(i+list.length)%list.length; const m=list[idx].querySelector('img'); img.src=m.src; img.alt=m.alt; cap.textContent=list[idx].querySelector('figcaption').textContent+'  ·  '+(idx+1)+' / '+list.length;};
    const open=f=>{last=document.activeElement; list=figs.filter(x=>!x.hidden); show(list.indexOf(f)); lb.classList.add('open'); $('.lb .x').focus();};
    const close=()=>{lb.classList.remove('open'); last&&last.focus();};
    figs.forEach(f=>f.querySelector('button').addEventListener('click',()=>open(f)));
    $('.lb .x').addEventListener('click',close); $('.lb .p').addEventListener('click',()=>show(idx-1)); $('.lb .n').addEventListener('click',()=>show(idx+1));
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    addEventListener('keydown',e=>{ if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(idx-1); if(e.key==='ArrowRight')show(idx+1); });
    let x0=null; lb.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',e=>{ if(x0===null)return; const dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>50) show(dx<0?idx+1:idx-1); });
  }

  // Formulir RFQ -> WhatsApp
  const form=$('#rfq');
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form)); const err=$('#err');
    if(!d.nama||!d.wa||!d.kebutuhan||!d.deskripsi){err.style.display='block';err.textContent='Mohon isi nama, nomor WhatsApp, jenis kebutuhan, dan deskripsi pekerjaan.';return;}
    err.style.display='none';
    const file=form.querySelector('input[type=file]').files[0];
    const lines=['Halo CV. Mitra Tehnik Indonesia, saya ingin meminta penawaran (RFQ).','',
      `Nama: ${d.nama}`,`Perusahaan: ${d.perusahaan||'-'}`,`No. WhatsApp: ${d.wa}`,`Email: ${d.email||'-'}`,
      `Jenis kebutuhan: ${d.kebutuhan}`,`Material: ${d.material||'-'}`,`Jumlah: ${d.jumlah||'-'}`,'',
      'Deskripsi pekerjaan:',d.deskripsi,'',
      `Lampiran gambar/spesifikasi: ${file?file.name+' (akan saya kirim manual di chat ini)':'tidak ada'}`,'',
      'Mohon informasi lebih lanjut. Terima kasih.'];
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener');
  });

  // ===== Animasi (tanpa library; konten selalu terlihat jika JS/animasi gagal) =====
  if(reduce) return;
  root.classList.add('io');

  // 1) Elemen yang muncul saat di-scroll
  const sel='.reveal, .pcard, .acard, .exp article, .svc article, .tl li, .kpis div, .ticks li, .pf figure';
  const items=$$(sel);
  const groups=new Map();
  items.forEach(el=>{const p=el.parentElement; if(!groups.has(p)) groups.set(p,[]); groups.get(p).push(el);});
  groups.forEach(list=>list.forEach((el,i)=>{ el.classList.add('rv'); el.style.transitionDelay=(Math.min(i,6)*90)+'ms'; }));
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:0, rootMargin:'0px 0px -4% 0px'});
  items.forEach(el=>io.observe(el));

  // Cadangan: tandai elemen yang sudah terlihat saat scroll cepat
  const checkRv=()=>{ if(scrollY+innerHeight>=document.documentElement.scrollHeight-4) $$('.rv,.imgr').forEach(el=>el.classList.add('in')); $$('.rv:not(.in)').forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<innerHeight*.96 && r.bottom>0) el.classList.add('in'); }); $$('.imgr:not(.in)').forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<innerHeight*.9 && r.bottom>0) el.classList.add('in'); }); };
  addEventListener('scroll',()=>requestAnimationFrame(checkRv),{passive:true}); addEventListener('load',checkRv); checkRv();
  // 2) Gambar: buka dari bawah
  const imgs=$$('.img-reveal');
  const io2=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io2.unobserve(en.target); } });
  },{threshold:.2});
  imgs.forEach(el=>{el.classList.add('imgr'); io2.observe(el);});

  // 3) Angka naik (rating dan jumlah ulasan)
  $$('.count').forEach(el=>{
    const to=parseFloat(el.dataset.to), dec=parseInt(el.dataset.dec||'0',10); const final=el.textContent;
    const io3=new IntersectionObserver(([en])=>{
      if(!en.isIntersecting) return; io3.disconnect();
      const t0=performance.now(), dur=1600;
      const tick=t=>{const k=Math.min((t-t0)/dur,1), e=1-Math.pow(1-k,3); el.textContent=(to*e).toFixed(dec); if(k<1) requestAnimationFrame(tick); else el.textContent=final;};
      requestAnimationFrame(tick);
    },{threshold:.6});
    io3.observe(el);
  });

  // 4) Parallax halus pada gambar
  const par=$$('.parallax');
  const onPar=()=>{ par.forEach(el=>{ const r=el.parentElement.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return; const p=(r.top+r.height/2-innerHeight/2)/innerHeight; el.style.transform=`translate3d(0,${(p*-30).toFixed(1)}px,0) scale(1.08)`; }); };
  if(par.length){ addEventListener('scroll',()=>requestAnimationFrame(onPar),{passive:true}); onPar(); }

  // 5) Garis timeline mengikuti scroll
  const fill=$('.tl .fill'), tl=$('.tl');
  if(fill&&tl){ const onTl=()=>{ const r=tl.getBoundingClientRect(); const k=Math.min(Math.max((innerHeight*.7-r.top)/r.height,0),1); fill.style.transform=`scaleY(${k})`; }; addEventListener('scroll',()=>requestAnimationFrame(onTl),{passive:true}); onTl(); }

  // 6) Tombol magnetik
  $$('.btn').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(); b.style.translate=`${((e.clientX-r.left-r.width/2)*.12).toFixed(1)}px ${((e.clientY-r.top-r.height/2)*.18).toFixed(1)}px`;});
    b.addEventListener('pointerleave',()=>{b.style.translate='';});
  });
})();
