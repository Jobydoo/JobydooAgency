/* Jobydoo Agency — interactions: nav, reveal, counters, motion, form */
(function(){
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header scrolled state */
  var header = document.querySelector(".header");
  function onScroll(){
    if(window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  /* Mobile nav */
  var burger = document.querySelector(".burger");
  var navLinks = document.querySelector(".nav-links");
  if(burger && navLinks){
    // Inject mobile CTA button if not present in drawer
    if(!navLinks.querySelector(".mobile-menu-cta")){
      var ctaLi = document.createElement("li");
      ctaLi.className = "mobile-menu-cta";
      ctaLi.innerHTML = '<a class="btn btn--primary" href="contact.html">Devis gratuit <span class="arr">→</span></a>';
      navLinks.appendChild(ctaLi);
    }

    function closeMenu(){
      navLinks.classList.remove("open");
      burger.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }

    function toggleMenu(){
      var isOpen = navLinks.classList.toggle("open");
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("no-scroll", isOpen);
    }

    burger.addEventListener("click", function(e){
      e.stopPropagation();
      toggleMenu();
    });

    navLinks.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        closeMenu();
      });
    });

    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && navLinks.classList.contains("open")){
        closeMenu();
      }
    });

    window.addEventListener("resize", function(){
      if(window.innerWidth > 960 && navLinks.classList.contains("open")){
        closeMenu();
      }
    }, {passive:true});
  }

  /* Scroll reveal (with clip-path image reveal) */
  var reveals = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !prefersReduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add("in");
          // Trigger clip-path image reveal on child media
          if(e.target.querySelector && e.target.querySelector(".shot, .split-media")){
            e.target.classList.add("clip-ready");
            setTimeout(function(){ e.target.classList.remove("clip-ready"); }, 60);
          }
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:"0px 0px -40px 0px"});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add("in"); });
  }

  /* Animated counters */
  function animateCount(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1400, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start)/dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = prefix + val.toLocaleString("fr-FR") + suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString("fr-FR") + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if("IntersectionObserver" in window && !prefersReduced){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); }
      });
    }, {threshold:0.5});
    counters.forEach(function(el){ cio.observe(el); });
  } else {
    counters.forEach(function(el){ el.textContent = (el.getAttribute("data-prefix")||"") + el.getAttribute("data-count") + (el.getAttribute("data-suffix")||""); });
  }

  /* Tilt-on-hover for cards (subtle motion) */
  if(!prefersReduced){
    document.querySelectorAll(".card, .pack, .port-card").forEach(function(card){
      card.addEventListener("mousemove", function(ev){
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left)/r.width - .5;
        var y = (ev.clientY - r.top)/r.height - .5;
        card.style.transform = "translateY(-8px) rotateX(" + (y*-4) + "deg) rotateY(" + (x*4) + "deg)";
      });
      card.addEventListener("mouseleave", function(){ card.style.transform = ""; });
    });
  }

  /* Contact form: POST to Formsubmit.co (HTML response, no JSON, delivers directly to Gmail) */
  var form = document.getElementById("contactForm");
  if(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name")||"").toString().trim();
      var email = (data.get("email")||"").toString().trim();
      var msg = (data.get("message")||"").toString().trim();
      if(!name || !email || !msg){
        alert("Merci de remplir tous les champs obligatoires.");
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      if(btn){ btn.disabled = true; btn.textContent = "Envoi en cours…"; }

      // 1) Post to Formsubmit.co (HTML response, no JSON, delivers directly to Gmail)
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "text/html" }
      }).then(function(r){
        // Formsubmit.co returns 200 + HTML thank-you page on success
        if(!r.ok) throw new Error("HTTP " + r.status);
        form.reset();
        var ok = document.getElementById("formOk");
        if(ok){ ok.style.display = "block"; ok.textContent = "Merci " + name.split(" ")[0] + " ! Votre demande a bien été envoyée. On vous répond sous 24h ouvrées."; }
      }).catch(function(err){
        // 2) Fallback: open mail client pre-filled to owner Gmail
        var subject = encodeURIComponent("Nouvelle demande Jobydoo — " + (data.get("service")||"Contact"));
        var body = encodeURIComponent(
          "Nom: " + name + "\nEmail: " + email + "\nSociété: " + (data.get("company")||"—") +
          "\nService: " + (data.get("service")||"—") + "\n\nMessage:\n" + msg
        );
        window.location.href = "mailto:jobthemaan@gmail.com?subject=" + subject + "&body=" + body;
        var ok = document.getElementById("formOk");
        if(ok){ ok.style.display = "block"; ok.style.color = "var(--amber)"; ok.textContent = "Le serveur n'a pas répondu. Votre messagerie vient de s'ouvrir avec votre demande pré-remplie — vérifiez bien que jobthemaan@gmail.com est bien le destinataire."; }
        console.warn("Formsubmit.co error, fallback mailto:", err);
      }).finally(function(){
        if(btn){ btn.disabled = false; btn.innerHTML = 'Envoyer ma demande <span class="arr">→</span>'; }
      });
    });
  }

  /* Year in footer */
  var y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function(q){
    q.addEventListener("click", function(){
      var item = q.closest(".faq-item");
      var open = item.classList.contains("open");
      // close siblings for clean accordion
      item.parentNode.querySelectorAll(".faq-item.open").forEach(function(o){ if(o!==item) o.classList.remove("open"); });
      item.classList.toggle("open", !open);
    });
  });

  /* ROI simulator */
  var sim = document.getElementById("roiSim");
  if(sim){
    var ca = sim.querySelector("#ca"), hours = sim.querySelector("#hours"), adb = sim.querySelector("#adb");
    var oTime = sim.querySelector("#oTime"), oSave = sim.querySelector("#oSave"), oGain = sim.querySelector("#oGain"), oTotal = sim.querySelector("#oTotal");
    var vCa = sim.querySelector("#vCa"), vHours = sim.querySelector("#vHours"), vAdb = sim.querySelector("#vAdb");
    function fmt(n){ return Math.round(n).toLocaleString("fr-FR"); }
    function calc(){
      var caV = parseFloat(ca.value), hV = parseFloat(hours.value), adbV = parseFloat(adb.value);
      vCa.textContent = fmt(caV) + " MAD"; vHours.textContent = hV + " h"; vAdb.textContent = fmt(adbV) + " MAD";
      var timeFree = (hV * 0.75); // 75% of manual hours recovered
      var savings = timeFree * (caV/ (40*52)) * 1; // value of freed time (rough)
      var saveMAD = savings * 52;
      // savings on manual tasks: 75% of hours * hourly value, annualized
      var hourly = caV / (40*52);
      saveMAD = timeFree * hourly * 52;
      var gainMAD = (caV * 0.12) + (adbV * 0.25); // +12% CA via web/seo/ads, +25% of ad budget better spent
      var total = saveMAD + gainMAD;
      oTime.textContent = "~" + fmt(timeFree) + " h / sem";
      oSave.textContent = "+" + fmt(saveMAD) + " MAD/an";
      oGain.textContent = "+" + fmt(gainMAD) + " MAD/an";
      oTotal.textContent = "+" + fmt(total) + " MAD";
    }
    [ca,hours,adb].forEach(function(el){ el.addEventListener("input", calc); });
    calc();
  }

  /* Brand normalization: ensure no gap before dot */
  document.querySelectorAll(".brand").forEach(function(b){
    if(!b.querySelector(".brand-name")){
      var logo = b.querySelector(".logo");
      if(logo){
        var nameSpan = document.createElement("span");
        nameSpan.className = "brand-name";
        nameSpan.innerHTML = 'Jobydoo<span class="brand-dot">.</span>';
        b.innerHTML = "";
        b.appendChild(logo);
        b.appendChild(nameSpan);
      }
    }
  });

  /* ==================== Multi-language (FR / EN) ==================== */
  var I18N = {
    fr: {
      "nav.home": "Accueil",
      "nav.web": "Création de site web",
      "nav.ads": "Media Buying",
      "nav.crm": "CRM sur mesure",
      "nav.apps": "Applications générales",
      "nav.pricing": "Tarifs",
      "nav.portfolio": "Portfolio",
      "nav.about": "À propos",
      "nav.contact": "Contact",
      "nav.quote": 'Devis gratuit <span class="arr">→</span>',

      "hero.eyebrow": "Agence Web Maroc · Marketing Agency Morocco · Digital Maroc",
      "hero.h1": 'On construit votre <span class="hl">croissance digitale</span> pendant que vous gérez votre business.',
      "hero.sub": "Jobydoo réunit <b>création de site web</b>, <b>media buying</b> et <b>CRM sur mesure</b> sous un même toit — agence web maroc et marketing agency morocco, pour automatiser vos tâches et réduire vos coûts.",
      "hero.ctaPrimary": 'Démarrer mon projet <span class="arr">→</span>',
      "hero.ctaSecondary": "Voir nos réalisations",
      "hero.stat1": "projets livrés",
      "hero.stat2": "coûts acquis en moins",
      "hero.stat3": "clients accompagnés",
      "hero.stat4": "support & automatisation",

      "pillars.eyebrow": "Nos trois piliers",
      "pillars.h2": "Une agence, trois métiers qui travaillent ensemble",
      "pillars.lead": "Au lieu de jongler avec trois prestataires, vous avez un seul partenaire qui aligne votre site, vos campagnes et votre gestion client.",

      "card1.title": "Création de site web",
      "card1.desc": 'Sites vitrines, e-commerce et plateformes sur mesure. Design UX "in motion", responsive mobile, performances et SEO technique dès la base.',
      "card1.more": 'Explorer <span class="arr">→</span>',

      "card2.title": "Media Buying",
      "card2.desc": "Google Ads, Meta Ads et retargeting. Nous baissons votre coût par acquisition et transformons votre trafic en clients réels.",
      "card2.more": 'Explorer <span class="arr">→</span>',

      "card3.title": "Création de CRM sur mesure",
      "card3.desc": "Un CRM pensé pour VOTRE entreprise : pipeline commercial et automatisations pour suivre chaque lead sans outil disjoint.",
      "card3.more": 'Explorer <span class="arr">→</span>',

      "card4.title": "Applications générales",
      "card4.desc": "Gestion de stock, gestion commerciale, outils métier et intégrations Sage 100 Cloud — des applications sur mesure pour automatiser vos processus.",
      "card4.more": 'Explorer <span class="arr">→</span>',

      "quotes.eyebrow": "Ce qu'on entend",
      "quotes.h2": "« Enfin un prestataire qui pense à mon temps. »",
      "quote1.text": "Mon site et mes campagnes enfin connectés. Je suis notifié dès qu'un lead arrive, sans ouvrir 5 outils.",
      "quote2.text": "Le CRM fait le suivi à ma place. Mes commerciaux gagnent 10h par semaine.",

      "cta.h2": "Construisons le site et les outils qui font grandir votre entreprise.",
      "cta.p": "Parlons de vos tâches chronophages et de vos objectifs. Devis clair, sans engagement.",
      "cta.btn": 'Demander un devis gratuit <span class="arr">→</span>',

      "footer.desc": "Agence web au Maroc. Création de site web, media buying et CRM sur mesure, automatisés.",
      "footer.services": "Services",
      "footer.agency": "Agence",
      "footer.rights": "Tous droits réservés.",
      "footer.sub": "Agence Web · Media Buying · CRM — Maroc"
    },
    en: {
      "nav.home": "Home",
      "nav.web": "Website Creation",
      "nav.ads": "Media Buying",
      "nav.crm": "Custom CRM",
      "nav.apps": "Custom Apps",
      "nav.pricing": "Pricing",
      "nav.portfolio": "Portfolio",
      "nav.about": "About Us",
      "nav.contact": "Contact",
      "nav.quote": 'Free Quote <span class="arr">→</span>',

      "hero.eyebrow": "Morocco Web Agency · Marketing Agency Morocco · Digital Growth",
      "hero.h1": 'We build your <span class="hl">digital growth</span> while you run your business.',
      "hero.sub": "Jobydoo brings <b>website creation</b>, <b>media buying</b> and <b>custom CRM</b> under one roof — automating your workflows and cutting your acquisition costs.",
      "hero.ctaPrimary": 'Start My Project <span class="arr">→</span>',
      "hero.ctaSecondary": "View Our Work",
      "hero.stat1": "projects delivered",
      "hero.stat2": "lower acquisition costs",
      "hero.stat3": "clients supported",
      "hero.stat4": "24/7 support & automation",

      "pillars.eyebrow": "Our Three Pillars",
      "pillars.h2": "One agency, three core disciplines working together",
      "pillars.lead": "Instead of juggling multiple vendors, you get a single partner aligning your website, ad campaigns, and customer management.",

      "card1.title": "Website Creation",
      "card1.desc": 'Showcase websites, e-commerce, and custom platforms. Motion UX design, mobile responsiveness, fast performance, and technical SEO from day one.',
      "card1.more": 'Explore <span class="arr">→</span>',

      "card2.title": "Media Buying",
      "card2.desc": "Google Ads, Meta Ads and retargeting. We lower your acquisition costs and turn your traffic into paying clients.",
      "card2.more": 'Explore <span class="arr">→</span>',

      "card3.title": "Custom CRM",
      "card3.desc": "A CRM tailored to YOUR business: sales pipelines and automated follow-ups to track every lead without disconnected tools.",
      "card3.more": 'Explore <span class="arr">→</span>',

      "card4.title": "Custom Applications",
      "card4.desc": "Inventory management, ERP tools, and Sage 100 Cloud integrations — bespoke software to automate your operations.",
      "card4.more": 'Explore <span class="arr">→</span>',

      "quotes.eyebrow": "What Clients Say",
      "quotes.h2": "\"Finally a partner who values my time.\"",
      "quote1.text": "My website and campaigns are finally synced. I get notified immediately when a lead arrives, without checking 5 different apps.",
      "quote2.text": "The CRM automates our follow-ups. Our sales reps save 10 hours every week.",

      "cta.h2": "Let's build the website and tools that grow your business.",
      "cta.p": "Let's discuss your time-consuming bottlenecks and your growth goals. Clear, no-obligation quote.",
      "cta.btn": 'Request a Free Quote <span class="arr">→</span>',

      "footer.desc": "Web & Marketing Agency in Morocco. Website creation, media buying, and custom automated CRMs.",
      "footer.services": "Services",
      "footer.agency": "Agency",
      "footer.rights": "All rights reserved.",
      "footer.sub": "Web Agency · Media Buying · CRM — Morocco"
    }
  };

  var currentLang = "fr";
  try {
    var urlParams = new URLSearchParams(window.location.search);
    var pLang = urlParams.get("lang");
    if(pLang === "en" || pLang === "fr"){
      currentLang = pLang;
      localStorage.setItem("jobydoo_lang", pLang);
    } else {
      currentLang = localStorage.getItem("jobydoo_lang") || "fr";
    }
  } catch(e){}

  function applyLanguage(lang){
    currentLang = lang;
    try { localStorage.setItem("jobydoo_lang", lang); } catch(e){}
    document.documentElement.lang = lang;

    // Update all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(I18N[lang] && I18N[lang][key]){
        el.innerHTML = I18N[lang][key];
      }
    });

    // Update floating and header lang toggles
    document.querySelectorAll(".lang-toggle, .lang-toggle-nav").forEach(function(btn){
      if(lang === "en"){
        btn.innerHTML = '<span class="globe">🌐</span> <span class="oth">FR</span> / <span class="cur">EN</span>';
      } else {
        btn.innerHTML = '<span class="globe">🌐</span> <span class="cur">FR</span> / <span class="oth">EN</span>';
      }
    });

    // Update mobile drawer switch buttons
    document.querySelectorAll(".mobile-lang-switch button").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
  }

  // Delegated click for any lang toggle buttons (floating, header, nav)
  document.addEventListener("click", function(e){
    var toggleBtn = e.target.closest(".lang-toggle, .lang-toggle-nav");
    if(toggleBtn){
      e.preventDefault();
      applyLanguage(currentLang === "fr" ? "en" : "fr");
    }
  });

  // Inject in mobile drawer if not present
  if(navLinks && !navLinks.querySelector(".mobile-lang-switch")){
    var langLi = document.createElement("li");
    langLi.className = "mobile-lang-switch";
    langLi.innerHTML = '<span class="label">🌐 Langue / Language:</span><div class="switch-btns"><button type="button" data-lang="fr"' + (currentLang === 'fr' ? ' class="active"' : '') + '>FR</button><button type="button" data-lang="en"' + (currentLang === 'en' ? ' class="active"' : '') + '>EN</button></div>';
    var ctaEl = navLinks.querySelector(".mobile-menu-cta");
    if(ctaEl) navLinks.insertBefore(langLi, ctaEl);
    else navLinks.appendChild(langLi);

    langLi.querySelectorAll("button").forEach(function(b){
      b.addEventListener("click", function(ev){
        ev.preventDefault();
        applyLanguage(b.getAttribute("data-lang"));
      });
    });
  }

  // Initial apply
  applyLanguage(currentLang);
})();

