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
      "pillars.eyebrow": "Nos piliers d'expertise",
      "pillars.h2": "Une agence, quatre compétences au service de votre croissance",
      "pillars.lead": "Au lieu de jongler avec plusieurs prestataires, vous avez un seul partenaire qui aligne votre site web, vos publicités et vos logiciels de gestion.",

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

      "eco.eyebrow": "Écosystème & Partenaires",
      "eco.h2": "Technologies certifiées & plateformes de confiance",
      "eco.lead": "Nous connectons vos outils web aux plateformes leaders mondiales pour garantir sécurité, rapidité et fort taux de conversion.",
      "eco1.title": "Google Partner Ecosystem",
      "eco1.desc": "Google Ads, Analytics 4, Tag Manager & Google Search Console pour dominer les recherches stratégiques.",
      "eco2.title": "Meta Business Ecosystem",
      "eco2.desc": "Meta Ads, Facebook Pixel, Instagram Shopping & Conversion API pour cibler vos acheteurs idéaux.",
      "eco3.title": "Vercel & Cloud Edge",
      "eco3.desc": "Hébergement Cloud ultra-performant avec CDN global, SSL sécurisé et vitesse d'affichage sous la seconde.",
      "eco4.title": "Sage 100 Cloud Integration",
      "eco4.desc": "Connecteurs d'API sur-mesure pour synchroniser vos commandes web et stocks directement avec votre ERP Sage 100.",
      "eco5.title": "WooCommerce & Shopify",
      "eco5.desc": "Architecture e-commerce moderne, rapide, scalable et sécurisée pour gérer des milliers de références produits.",
      "eco6.title": "CMI & Stripe Payments",
      "eco6.desc": "Intégration fluide des passerelles de paiement bancaire marocain CMI (Dirhams) et Stripe pour l'international.",

      "secWeb.eyebrow": "Création de site web",
      "secWeb.h2": "Des sites vitrines & e-commerce conçus pour convertir",
      "secWeb.lead": "Votre site web est votre commercial N°1. Nous créons des plateformes ultra-rapides, adaptées aux mobiles et pensées pour le référencement Google au Maroc et à l'international.",
      "secWeb.f1Title": "Performance & Vitesse Extrême :",
      "secWeb.f1Desc": "Temps de chargement inférieur à 1 seconde sur smartphone.",
      "secWeb.f2Title": "Design sur mesure & UX Motion :",
      "secWeb.f2Desc": "Une expérience visuelle haut de gamme qui rassure vos prospects.",
      "secWeb.f3Title": "SEO Technique Inclus :",
      "secWeb.f3Desc": "Code optimisé pour remonter naturally sur Google Casablanca, Rabat & Export.",
      "secWeb.cta": 'Découvrir la création de site web <span class="arr">→</span>',
      "secWeb.boxH3": "Création Web sans compromis",
      "secWeb.boxP": "Que ce soit un site vitrine institutionnel ou une boutique e-commerce à fort volume, nous garantissons un code propre, zéro lenteur et une autonomie totale de gestion.",

      "secAds.eyebrow": "Media Buying & Ads",
      "secAds.h2": "Campagnes Google & Meta orientées rentabilité immédiate",
      "secAds.lead": "Stoppez le gaspillage de budget publicitaire. Nous configurons vos tunnels d'acquisition pour capter des leads et ventes qualifiés au meilleur coût.",
      "secAds.f1Title": "Google Ads (Search & Shopping) :",
      "secAds.f1Desc": "Apparaissez exactement quand vos futurs clients cherchent vos services.",
      "secAds.f2Title": "Meta Ads (Facebook & Instagram) :",
      "secAds.f2Desc": "Ciblage hyper-précis par centres d'intérêt, zone géographique et retargeting.",
      "secAds.f3Title": "Suivi de Conversion Précis :",
      "secAds.f3Desc": "Traçabilité complète pour savoir exactement quel dirham investi génère du chiffre.",
      "secAds.cta": 'Explorer nos stratégies Media Buying <span class="arr">→</span>',
      "secAds.boxH3": "Optimisation continue du ROI",
      "secAds.boxP": "Nous testons en permanence de nouveaux visuels, textes et audiences pour faire baisser votre coût par acquisition (CPA) semaine après semaine.",

      "secCrm.eyebrow": "CRM sur mesure & Automatisation",
      "secCrm.h2": "Suivez 100% de vos leads sans perdes une seule seconde",
      "secCrm.lead": "Fini les tableaux Excel éparpillés et les prospects oubliés. Notre CRM sur mesure centralise vos demandes web et automatise le suivi de vos commerciaux sur WhatsApp.",
      "secCrm.f1Title": "Alertes Instantanées WhatsApp :",
      "secCrm.f1Desc": "Recevez une notification instantanée dès qu'un prospect fait une demande.",
      "secCrm.f2Title": "Pipeline Commercial Visuel :",
      "secCrm.f2Desc": "Visualisez l'état de vos devis (Nouveau, Relancé, Devis Envoyé, Gagné).",
      "secCrm.f3Title": "Zero Abonnement par Utilisateur :",
      "secCrm.f3Desc": "Vous restez propriétaire de votre solution sans payer des frais mensuels récurrents.",
      "secCrm.cta": 'Découvrir le CRM sur mesure <span class="arr">→</span>',
      "secCrm.boxH3": "Automatisation de votre suivi",
      "secCrm.boxP": "Développé spécifiquement pour la manière de travailler de votre équipe. Relances automatiques, relances clients et rapports d'activité en 1 clic.",

      "secApps.eyebrow": "Applications Générales & ERP",
      "secApps.h2": "Des logiciels sur mesure et connecteurs Sage 100 Cloud",
      "secApps.lead": "Digitalisez vos opérations complexes : gestion de stock, portail clients, suivi de production et passerelles personnalisées avec votre ERP Sage 100.",
      "secApps.f1Title": "Passerelle Sage 100 Cloud :",
      "secApps.f1Desc": "Synchronisation automatique des articles, stocks, clients et factures.",
      "secApps.f2Title": "Gestion de Stock & Inventaires :",
      "secApps.f2Desc": "Suivi en temps réel des entrées/sorties avec interface sur tablette et smartphone.",
      "secApps.f3Title": "Portails B2B sécurisés :",
      "secApps.f3Desc": "Offrez un espace privé à vos clients pour passer commande et télécharger leurs factures.",
      "secApps.cta": 'Voir les Applications Métier <span class="arr">→</span>',
      "secApps.boxH3": "Supprimez la double saisie",
      "secApps.boxP": "Gagnez des dizaines d'heures de travail manuel chaque semaine en connectant vos outils terrain directement avec votre comptabilité et votre logistique.",

      "secPort.eyebrow": "Nos Réalisations",
      "secPort.h2": "Projets récents livrés à nos clients",
      "secPort.lead": "Découvrez des exemples de projets réels conçus pour des PME et entreprises au Maroc et à l'international.",
      "port1.title": "Morocco Desert Trips",
      "port1.desc": "Plateforme web d'excursions, moteur de réservation direct multi-devises et relances automatiques par WhatsApp.",
      "port1.res": "🔥 +140% réservations directes",
      "port2.title": "Boutique Mode Casablanca",
      "port2.desc": "E-commerce ultra-rapide optimisé sur mobile avec paiement par carte bancaire CMI et suivi des stocks.",
      "port2.res": "⚡ Temps de charge 0.8s",
      "port3.title": "Transport & Logistique Tanger",
      "port3.desc": "Application mobile pour les chauffeurs et connecteur temps réel vers l'ERP Sage 100 de l'entreprise.",
      "port3.res": "⏱️ -12h de gestion / semaine",
      "secPort.cta": 'Voir tous les projets du portfolio <span class="arr">→</span>',

      "secAbout.eyebrow": "À propos de Jobydoo",
      "secAbout.h2": "Pourquoi les entreprises travaillent avec nous ?",
      "secAbout.lead": "Une approche pragmatique : pas de promesses creuses, pas de jargon technique, mais des résultats mesurables et une réactivité totale.",
      "ab1.title": "Délais ultra-rapides",
      "ab1.desc": "Vos projets livrés en quelques jours, pas en plusieurs mois de réunions interminables.",
      "ab2.title": "Un interlocuteur unique",
      "ab2.desc": "Un contact direct via WhatsApp et téléphone avec les développeurs de votre projet.",
      "ab3.title": "Expertise Maroc & Export",
      "ab3.desc": "Parfaite connaissance des enjeux économiques locaux, des paiements CMI et des habitudes d'achat.",
      "ab4.title": "Culture du résultat",
      "ab4.desc": "Chaque dirham investi dans votre site ou vos pubs doit rapporter de nouveaux prospects.",
      "secAbout.cta": 'En savoir plus sur l\'agence <span class="arr">→</span>',

      "quotes.eyebrow": "Témoignages Clients",
      "quotes.h2": "Des retours d'expérience authentiques et sans filtre",
      "quotes.lead": "Voici les avis réels de nos clients sur nos prestations web, nos campagnes ads et nos outils sur mesure.",
      "quote1.text": "Honnêtement, le premier prototype avait un petit retard de 2 jours sur les visuels, mais dès qu'on a lancé les campagnes Google Ads avec le nouveau site, nos réservations directes ont fait +140%. L'équipe est super réactive sur WhatsApp quand on a besoin.",
      "quote2.text": "J'hésitais à investir dans un CRM sur mesure parce qu'on utilisait encore Excel depuis 10 ans. Au début mon équipe râlait un peu face au changement, mais 2 semaines plus tard tout le monde avait pris la main. On gagne au moins 8h par semaine sur le suivi des devis.",
      "quote3.text": "Toutes les agences qu'on avait testées avant promettaient la lune sur Meta Ads. Jobydoo ne fait pas de fausses promesses : ils ont d'abord corrigé notre tunnel de vente puis ajusté notre ciblage. Notre coût par commande a chuté de 35%.",
      "quote4.text": "Notre gestion de stock sous Sage 100 était déconnectée de nos commerciaux sur le terrain. Jobydoo nous a développé un connecteur sur mesure. Il y a eu un petit bug le premier jour sur les devises, mais réglé en 1 heure par leur support.",
      "quote5.text": "On voulait une application métier simple pour le suivi des chantiers sans payer 50 000 DH/mois chez des éditeurs bloquants. Ils nous ont livré un outil sur mesure en 12 jours. C'est droit au but, pas de fioritures inutiles, ça fonctionne.",
      "quote6.text": "Un site vitrine très propre et super rapide sur mobile. Mes clients me disent enfin que mon site fait crédible. Et le prix était très honnête comparé aux devis exorbitants reçus ailleurs.",

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
      "pillars.eyebrow": "Our Core Expertise",
      "pillars.h2": "One agency, four disciplines powering your business growth",
      "pillars.lead": "Instead of juggling multiple vendors, you get a single partner aligning your website, ad campaigns, and business software.",

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

      "eco.eyebrow": "Ecosystem & Partners",
      "eco.h2": "Certified Technologies & Trusted Platforms",
      "eco.lead": "We connect your web tools to world-leading platforms to guarantee security, speed, and high conversion rates.",
      "eco1.title": "Google Partner Ecosystem",
      "eco1.desc": "Google Ads, Analytics 4, Tag Manager & Search Console to dominate search visibility.",
      "eco2.title": "Meta Business Ecosystem",
      "eco2.desc": "Meta Ads, Facebook Pixel, Instagram Shopping & Conversion API to target ideal buyers.",
      "eco3.title": "Vercel & Cloud Edge",
      "eco3.desc": "Ultra-fast Cloud hosting with global CDN, secure SSL, and sub-second loading speed.",
      "eco4.title": "Sage 100 Cloud Integration",
      "eco4.desc": "Custom API connectors to sync your web orders and inventory directly with your Sage 100 ERP.",
      "eco5.title": "WooCommerce & Shopify",
      "eco5.desc": "Modern, fast, scalable, and secure e-commerce architecture for managing thousands of products.",
      "eco6.title": "CMI & Stripe Payments",
      "eco6.desc": "Seamless integration of Moroccan bank payment gateways CMI (MAD) and Stripe for international transactions.",

      "secWeb.eyebrow": "Website Creation",
      "secWeb.h2": "Showcase & E-commerce Websites Built to Convert",
      "secWeb.lead": "Your website is your #1 sales representative. We create ultra-fast, mobile-friendly platforms built for Google SEO in Morocco and abroad.",
      "secWeb.f1Title": "Performance & Extreme Speed:",
      "secWeb.f1Desc": "Loading speed under 1 second on smartphone.",
      "secWeb.f2Title": "Custom Design & Motion UX:",
      "secWeb.f2Desc": "A high-end visual experience that builds immediate trust.",
      "secWeb.f3Title": "Technical SEO Included:",
      "secWeb.f3Desc": "Code optimized to rank naturally on Google Casablanca, Rabat & International.",
      "secWeb.cta": 'Explore Website Creation <span class="arr">→</span>',
      "secWeb.boxH3": "Uncompromising Web Development",
      "secWeb.boxP": "Whether an institutional showcase site or high-volume e-commerce store, we guarantee clean code, zero lag, and full management autonomy.",

      "secAds.eyebrow": "Media Buying & Ads",
      "secAds.h2": "Google & Meta Campaigns Driven by Immediate ROI",
      "secAds.lead": "Stop wasting ad budget. We set up acquisition funnels to capture qualified leads and sales at the best cost.",
      "secAds.f1Title": "Google Ads (Search & Shopping):",
      "secAds.f1Desc": "Show up right when prospective clients search for your services.",
      "secAds.f2Title": "Meta Ads (Facebook & Instagram):",
      "secAds.f2Desc": "Hyper-precise targeting by interests, locations, and retargeting.",
      "secAds.f3Title": "Accurate Conversion Tracking:",
      "secAds.f3Desc": "Complete traceability to track every dollar/dirham invested to revenue.",
      "secAds.cta": 'Explore Media Buying Strategies <span class="arr">→</span>',
      "secAds.boxH3": "Continuous ROI Optimization",
      "secAds.boxP": "We continuously test new ad copy, visuals, and audiences to lower your cost per acquisition week after week.",

      "secCrm.eyebrow": "Custom CRM & Automation",
      "secCrm.h2": "Track 100% of Your Leads Without Wasting a Single Second",
      "secCrm.lead": "No more scattered Excel sheets or forgotten prospects. Our custom CRM centralizes web leads and automates sales follow-ups via WhatsApp.",
      "secCrm.f1Title": "Instant WhatsApp Alerts:",
      "secCrm.f1Desc": "Receive instant notifications as soon as a lead submits a request.",
      "secCrm.f2Title": "Visual Sales Pipeline:",
      "secCrm.f2Desc": "Track quote statuses visually (New, Contacted, Quote Sent, Won).",
      "secCrm.f3Title": "Zero Per-User Monthly Fees:",
      "secCrm.f3Desc": "You own your solution outright with no recurring per-user software fees.",
      "secCrm.cta": 'Explore Custom CRM <span class="arr">→</span>',
      "secCrm.boxH3": "Automate Your Sales Follow-Up",
      "secCrm.boxP": "Built specifically around your team's workflow. Automated follow-ups, client reminders, and 1-click reporting.",

      "secApps.eyebrow": "Custom Apps & ERP",
      "secApps.h2": "Bespoke Business Software & Sage 100 Cloud Connectors",
      "secApps.lead": "Digitize complex operations: inventory management, client portals, production tracking, and custom connectors for Sage 100 ERP.",
      "secApps.f1Title": "Sage 100 Cloud Bridge:",
      "secApps.f1Desc": "Automated real-time synchronization of items, stock, clients, and invoices.",
      "secApps.f2Title": "Stock & Inventory Management:",
      "secApps.f2Desc": "Real-time stock tracking with mobile & tablet interfaces.",
      "secApps.f3Title": "Secure B2B Client Portals:",
      "secApps.f3Desc": "Provide a private portal for clients to place orders and download invoices.",
      "secApps.cta": 'View Custom Business Apps <span class="arr">→</span>',
      "secApps.boxH3": "Eliminate Manual Data Entry",
      "secApps.boxP": "Save dozens of hours of manual entry every week by linking field operations directly with accounting & logistics.",

      "secPort.eyebrow": "Our Portfolio",
      "secPort.h2": "Recent Client Projects Delivered",
      "secPort.lead": "Explore real-world projects built for businesses in Morocco and internationally.",
      "port1.title": "Morocco Desert Trips",
      "port1.desc": "Tour booking platform, multi-currency booking engine, and automated WhatsApp follow-ups.",
      "port1.res": "🔥 +140% direct bookings",
      "port2.title": "Fashion Boutique Casablanca",
      "port2.desc": "Ultra-fast mobile e-commerce store integrated with CMI credit card payment and stock tracking.",
      "port2.res": "⚡ 0.8s load time",
      "port3.title": "Transport & Logistics Tangier",
      "port3.desc": "Driver mobile app and real-time integration with company Sage 100 ERP.",
      "port3.res": "⏱️ -12h admin work / week",
      "secPort.cta": 'View All Portfolio Projects <span class="arr">→</span>',

      "secAbout.eyebrow": "About Jobydoo",
      "secAbout.h2": "Why Businesses Choose Us",
      "secAbout.lead": "A pragmatic approach: no empty promises or tech jargon, just measurable results and total responsiveness.",
      "ab1.title": "Ultra-Fast Delivery",
      "ab1.desc": "Your projects delivered in days, not endless months of meetings.",
      "ab2.title": "Single Point of Contact",
      "ab2.desc": "Direct communication via WhatsApp and phone with the developers building your project.",
      "ab3.title": "Morocco & Export Expertise",
      "ab3.desc": "Deep understanding of local market dynamics, CMI payments, and buyer behaviors.",
      "ab4.title": "ROI Culture",
      "ab4.desc": "Every dollar or dirham invested must generate qualified new leads.",
      "secAbout.cta": 'Learn More About Us <span class="arr">→</span>',

      "quotes.eyebrow": "Client Testimonials",
      "quotes.h2": "Authentic & Unfiltered Feedback",
      "quotes.lead": "Here is genuine feedback from our clients on our web development, ad campaigns, and custom tools.",
      "quote1.text": "Honestly, the first visual prototype was delayed by 2 days, but as soon as we launched the Google Ads campaigns with the new site, our direct bookings jumped by +140%. The team is super responsive on WhatsApp whenever needed.",
      "quote2.text": "I hesitated to invest in a custom CRM because we'd been using Excel for 10 years. At first my team grumbled about the change, but 2 weeks later everyone got the hang of it. We save at least 8h per week tracking quotes.",
      "quote3.text": "Every agency we tested before promised the moon on Meta Ads. Jobydoo doesn't make fake promises: they fixed our sales funnel first and then tuned targeting. Our cost per order dropped by 35%.",
      "quote4.text": "Our Sage 100 stock management was completely disconnected from our field reps. Jobydoo built a custom connector. There was a tiny currency glitch on day 1, but resolved within 1 hour by their support.",
      "quote5.text": "We wanted a simple custom app to track construction sites without paying 50,000 MAD/mo to rigid vendors. They delivered a custom tool in 12 days. Straight to the point, no bloat, it just works.",
      "quote6.text": "A very clean showcase site that's super fast on mobile. My clients finally tell me my site looks credible and professional. And the price was fair compared to inflated quotes received elsewhere.",

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

