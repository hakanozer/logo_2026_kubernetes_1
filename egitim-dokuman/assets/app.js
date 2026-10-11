(() => {
  const pages = [
    ["index.html", "Ana sayfa"], ["01-proje-analizi.html", "01 · Proje analizi"],
    ["02-ortam-kurulumu.html", "02 · Ortam kurulumu"],
    ...Array.from({length:14},(_,i)=>[`m${String(i+1).padStart(2,"0")}-${["giris","cluster","temel-objeler","konfigurasyon","ag","depolama","yasam-dongusu","ingress","kaynaklar","guvenlik","gozlemlenebilirlik","helm","sorun-giderme","uretim"][i]}.html`, `m${String(i+1).padStart(2,"0")} · ${["Giriş","Cluster yapısı","Temel objeler","Konfigürasyon","Servis ağı","Depolama","Yaşam döngüsü","Ingress","Kaynaklar","Güvenlik","Gözlemlenebilirlik","Helm","Sorun giderme","Üretim"][i]}`]),
    ["15-komut-sozlugu.html","15 · Komut sözlüğü"], ["16-egitim-akisi.html","16 · Eğitim akışı"]
  ];
  const $ = (selector, root=document) => root.querySelector(selector);
  const storageGet = key => {
    try { return localStorage.getItem(key); }
    catch (error) { console.warn("Bu dosya bağlamında tarayıcı depolaması kullanılamıyor.", error); return null; }
  };
  const storageSet = (key,value) => {
    try { localStorage.setItem(key,value); }
    catch (error) { console.warn("Tercih bu tarayıcıda kalıcı saklanamadı.", error); }
  };
  const page = document.body.dataset.page || "index.html";
  const sidebar = $(".sidebar nav");
  if (sidebar) sidebar.innerHTML = pages.map(([url,label]) => `<a href="${url}"${url===page?' aria-current="page"':''}>${label}</a>`).join("");

  const article = $("article");
  const toc = $(".toc");
  if (toc && article) {
    const headings = [...article.querySelectorAll("h2[id],h3[id]")];
    toc.innerHTML = `<strong>Bu sayfada</strong><div>${headings.map(h=>`<a href="#${h.id}">${h.textContent}</a>`).join("")}</div>`;
    toc.hidden = headings.length === 0;
  }

  document.querySelectorAll("pre").forEach(pre => {
    const code = $("code", pre);
    if (!code) return;
    const lang = pre.dataset.lang || code.className.replace("language-","") || "text";
    const label = document.createElement("span");
    label.className = "code-lang"; label.textContent = lang;
    const copy = document.createElement("button");
    copy.className = "copy-code"; copy.type = "button"; copy.textContent = "Kopyala";
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(code.innerText); copy.textContent="Kopyalandı"; }
      catch (error) { copy.textContent="Seçip kopyalayın"; console.error("Kod panoya kopyalanamadı", error); }
      setTimeout(()=>copy.textContent="Kopyala",1800);
    });
    pre.append(label,copy);
  });

  const root = document.documentElement;
  const themeButton = $("#theme-toggle");
  const savedTheme = storageGet("logo-ms-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    storageSet("logo-ms-theme",root.dataset.theme);
  });
  const viewButton = $("#view-toggle");
  const setView = view => {
    document.body.classList.toggle("participant-view",view==="participant");
    if(viewButton) viewButton.textContent=view==="participant"?"Katılımcı görünümü":"Eğitmen görünümü";
    storageSet("logo-ms-view",view);
  };
  setView(storageGet("logo-ms-view")||"instructor");
  viewButton?.addEventListener("click",()=>setView(document.body.classList.contains("participant-view")?"instructor":"participant"));

  const search = $("#site-search");
  search?.addEventListener("input",()=>{
    const q=search.value.trim().toLocaleLowerCase("tr");
    sidebar?.querySelectorAll("a").forEach(a=>a.hidden=!!q&&!a.textContent.toLocaleLowerCase("tr").includes(q));
    article?.querySelectorAll("section").forEach(s=>s.hidden=!!q&&!s.textContent.toLocaleLowerCase("tr").includes(q));
    article?.querySelectorAll("#command-table tbody tr").forEach(row=>row.hidden=!!q&&!row.textContent.toLocaleLowerCase("tr").includes(q));
  });

  const order=pages.findIndex(([url])=>url===page);
  const footer=$(".footer-nav");
  if(footer&&order>=0) {
    footer.innerHTML=`${order>0?`<a href="${pages[order-1][0]}">← ${pages[order-1][1]}</a>`:"<span></span>"}${order<pages.length-1?`<a href="${pages[order+1][0]}">${pages[order+1][1]} →</a>`:""}`;
  }
  let slide=0;
  const slides=article?[...article.querySelectorAll(":scope > section")]:[];
  const setSlide=next=>{if(!slides.length)return;slide=Math.max(0,Math.min(slides.length-1,next));document.body.classList.add("presentation");slides.forEach((s,i)=>s.classList.toggle("slide-active",i===slide));};
  const presentButton=$("#present-toggle");
  const stopPresent=()=>{document.body.classList.remove("presentation");slides.forEach(s=>s.classList.remove("slide-active"));};
  presentButton?.addEventListener("click",()=>document.body.classList.contains("presentation")?stopPresent():setSlide(0));
  document.addEventListener("keydown",e=>{
    if(e.key.toLowerCase()==="p"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){document.body.classList.contains("presentation")?stopPresent():setSlide(0);}
    if(document.body.classList.contains("presentation")){if(["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(e.key))e.preventDefault();if(e.key==="ArrowRight"||e.key==="ArrowDown")setSlide(slide+1);if(e.key==="ArrowLeft"||e.key==="ArrowUp")setSlide(slide-1);if(e.key==="Escape")stopPresent();}
  });
})();
