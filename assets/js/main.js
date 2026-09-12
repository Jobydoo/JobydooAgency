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
      if(window.innerWidth > 1180 && navLinks.classList.contains("open")){
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

  /* Contact form: POST to Formsubmit.co AJAX */
  var form = document.getElementById("contactForm");
  var ok = document.getElementById("formOk");
  var errBox = document.getElementById("formErr");

  if(ok) ok.style.display = "none";
  if(errBox) errBox.style.display = "none";

  if(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      if(errBox){ errBox.style.display = "none"; errBox.classList.remove("visible"); }
      if(ok){ ok.style.display = "none"; ok.classList.remove("visible"); }

      var data = new FormData(form);
      var name = (data.get("name")||"").toString().trim();
      var email = (data.get("email")||"").toString().trim();
      var msg = (data.get("message")||"").toString().trim();
      var phone = (data.get("phone")||"").toString().trim();
      var company = (data.get("company")||"").toString().trim();
      var service = (data.get("service")||"Création de site web").toString().trim();

      if(!name || !email || !msg){
        if(errBox){
          errBox.textContent = "Merci de remplir les champs obligatoires (Nom, Email et Message).";
          errBox.style.display = "block";
          errBox.classList.add("visible");
        } else {
          alert("Merci de remplir les champs obligatoires (Nom, Email et Message).");
        }
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var origBtnHtml = btn ? btn.innerHTML : "Envoyer ma demande";
      if(btn){ btn.disabled = true; btn.innerHTML = "Envoi en cours…"; }

      var payload = {
        name: name,
        email: email,
        company: company || "Non spécifié",
        phone: phone || "Non spécifié",
        service: service,
        message: msg,
        _subject: "Nouvelle demande Jobydoo Agency — " + service
      };

      fetch("https://formsubmit.co/ajax/jobthemaan@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(function(r){
        return r.json().then(function(json){
          if(!r.ok && json && json.success === "false") {
            throw new Error(json.message || ("HTTP " + r.status));
          }
          return json;
        });
      })
      .then(function(){
        form.reset();
        if(ok){
          var firstName = name.split(" ")[0] || "cher client";
          var txt = document.getElementById("okMsgText");
          if(txt){
            txt.textContent = "Merci " + firstName + " ! Votre demande a bien été envoyée. On vous répond sous 24h ouvrées.";
          }
          ok.style.display = "block";
          ok.classList.add("visible");
          ok.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      })
      .catch(function(err){
        console.warn("FormSubmit AJAX issue, opening mailto fallback:", err);
        // Fallback: mailto
        var subject = encodeURIComponent("Nouvelle demande Jobydoo — " + service);
        var body = encodeURIComponent(
          "Nom: " + name + "\nEmail: " + email + "\nTéléphone: " + (phone||"—") +
          "\nSociété: " + (company||"—") + "\nService: " + service + "\n\nMessage:\n" + msg
        );
        window.location.href = "mailto:jobthemaan@gmail.com?subject=" + subject + "&body=" + body;

        if(errBox){
          errBox.innerHTML = "Votre demande a été préparée dans votre messagerie email. Si elle ne s'ouvre pas automatiquement, vous pouvez aussi nous contacter directement sur <a href='https://wa.me/212645833671' target='_blank' style='color:#059669;font-weight:700;text-decoration:underline'>WhatsApp au +212 645 833 671</a>.";
          errBox.style.display = "block";
          errBox.classList.add("visible");
        }
      })
      .finally(function(){
        if(btn){ btn.disabled = false; btn.innerHTML = origBtnHtml; }
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
      "nav.faqs": "FAQ",
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
      "footer.sub": "Agence Web · Media Buying · CRM — Maroc",

      "portfolio.eyebrow": "Portfolio & Réalisations · Agence Web Maroc",
      "portfolio.h1": 'Nos <span class="hl">réalisations</span>, des résultats mesurés.',
      "portfolio.sub": "Découvrez nos sites web, campagnes publicitaires et outils CRM conçus pour propulser nos clients au Maroc et à l'international.",
      "portfolio.stat1": "Clients & projets livrés",
      "portfolio.stat2": "Croissance moyenne clients",
      "portfolio.stat3": "Vitesse moyenne de chargement",
      "portfolio.stat4": "Projets livrés dans les délais",
      "portfolio.featEyebrow": "Étude de cas phare",
      "portfolio.featTitle": "MoroccoDesertTrips.com — Vitrine, Expérience & Réservations Directes",
      "portfolio.featDesc": "Conception d'une plateforme web ultra-rapide dédiée au tourisme du Sahara marocain : tunnel de réservation direct, optimisation SEO multilingue et relances automatiques par WhatsApp.",
      "portfolio.featBtn": "Visiter moroccodeserttrips.com ↗",
      "portfolio.filterAll": "Tous les projets",
      "portfolio.filterTourism": "Tourisme & Voyage",
      "portfolio.filterLuxury": "Luxe & VIP",
      "portfolio.filterTech": "Tech & E-commerce",
      "portfolio.filterCrm": "CRM & Automatisation",
      "portfolio.filterB2b": "Services B2B",
      "portfolio.searchPlaceholder": "Rechercher par client, expertise, mot-clé...",
      "portfolio.gridEyebrow": "Projets & Partenaires",
      "portfolio.gridTitle": "L'ensemble de nos clients accompagnés",
      "portfolio.gridLead": "Filtrez par secteur d'activité ou utilisez la recherche instantanée pour explorer nos réalisations.",
      "portfolio.visitBtn": "Visiter le site",
      "portfolio.emptyTitle": "Aucun projet trouvé",
      "portfolio.emptyDesc": "Aucun client ne correspond à votre recherche actuelle. Essayez d'autres termes ou réinitialisez vos filtres.",
      "portfolio.emptyReset": "Réinitialiser les filtres",

      "nav.agency": "Agence de communication",

      "pricing.eyebrow": "Tarifs & Délais Réduits · Transparence Totale",
      "pricing.h1": 'Des prix imbattables, <span class="hl">des délais ultra-rapides.</span>',
      "pricing.sub": "Nous avons optimisé nos processus pour vous offrir la meilleure qualité du marché marocain à des tarifs réduits et des délais de livraison record. Devis clair, net et sans mauvaise surprise.",
      "pricing.ctaBtn": 'Demander un devis express <span class="arr">→</span>',
      "pricing.ctaGhost": "Voir nos offres & tarifs",
      "pricing.gridEyebrow": "Nos Tarifs & Délais 2026",
      "pricing.gridTitle": "Nos offres ajustées au meilleur prix du marché",
      "pricing.gridLead": "Découvrez nos tarifs réduits et nos temps de réalisation accélérés pour lancer votre projet en quelques jours seulement.",
      "p1.title": "Site Vitrine / Pro",
      "p1.desc": "Site web moderne 3 à 5 pages, design UX in-motion, responsive mobile, formulaire contact & SEO Google de base.",
      "p1.price": "~ 3 500 – 8 500 MAD",
      "p1.time": "⏱️ Livraison : 3 à 5 jours ouvrés",
      "p2.title": "Site E-Commerce",
      "p2.desc": "Boutique en ligne complète, catalogue produits, paiement CMI/Stripe/Cash, suivi de commandes & WhatsApp direct.",
      "p2.price": "~ 8 500 – 18 500 MAD",
      "p2.time": "⏱️ Livraison : 7 à 12 jours ouvrés",
      "p3.title": "Blog & Rédaction SEO",
      "p3.desc": "Espace blog optimisé avec CMS ultra-rapide, stratégie de contenu et articles rédigés pour positionner votre marque sur Google.",
      "p3.price": "~ 2 500 – 6 500 MAD",
      "p3.time": "⏱️ Livraison : 3 à 5 jours ouvrés",
      "p4.title": "Media Buying (Google & Meta Ads)",
      "p4.desc": "Gestion stratégique de vos campagnes Ads, réduction du coût par prospect (CPL), rapports hebdomadaires & optimisation ROI.",
      "p4.price": "~ 1 800 – 5 500 MAD / mois",
      "p4.time": "⚡ Lancement : 48h à 72h",
      "p5.title": "CRM Sur Mesure (PME & Écoles)",
      "p5.desc": "Centralisation des prospects web/WhatsApp, pipeline commercial visuel, relances automatisées et zéro frais d'abonnement.",
      "p5.price": "~ 7 500 – 18 000 MAD",
      "p5.time": "⏱️ Livraison : 7 à 14 jours ouvrés",
      "p6.title": "Applications & Connecteurs ERP",
      "p6.desc": "Outils de gestion de stock, portails B2B et connecteurs d'API sur-mesure pour Sage 100 Cloud et logiciels tiers.",
      "p6.price": "~ 9 500 – 28 000 MAD",
      "p6.time": "⏱️ Déploiement : 10 à 20 jours",
      "p7.title": "Maintenance & Infogérance",
      "p7.desc": "Sauvegardes régulières, mises à jour de sécurité, monitoring de disponibilité 24/7 et assistance technique prioritaire.",
      "p7.price": "~ 800 – 2 200 MAD / mois",
      "p7.time": "⚡ Support continu",
      "p8.title": "Audit Digital & Conseil Express",
      "p8.desc": "Audit complet de votre site actuel, de vos campagnes publicitaires et de votre conversion avec plan d'action immédiat.",
      "p8.price": "Offert (ou 1 200 MAD complet)",
      "p8.time": "⚡ Activation immédiate",
      "pricing.faqEyebrow": "Questions fréquentes",
      "pricing.faqTitle": "Tarifs & Délais — FAQ",
      "pricing.ctaH2": "Vous avez un projet ou une idée de budget ?",
      "pricing.ctaP": "Recevez une proposition tarifaire détaillée et un planning de livraison sous 24h ouvrées.",
      "pricing.ctaBtn2": 'Demander mon devis express <span class="arr">→</span>',

      "contact.eyebrow": "Contact · Devis gratuit",
      "contact.h1": 'Parlons de votre <span class="hl">projet</span>.',
      "contact.sub": "Dites-nous votre activité, vos tâches chronophages et vos objectifs. On revient vers vous avec une proposition claire, sans engagement.",
      "contact.formEyebrow": "Écrivez-nous",
      "contact.formH2": "Demandez un devis gratuit",
      "contact.formLead": "Remplissez le formulaire — vous recevez une proposition claire sous 24h ouvrées.",
      "contact.lblName": "Nom complet *",
      "contact.lblEmail": "Email professionnel *",
      "contact.lblCompany": "Société / Projet",
      "contact.lblPhone": "Téléphone / WhatsApp",
      "contact.lblService": "Service souhaité",
      "contact.lblMessage": "Description de votre projet *",
      "contact.phName": "Votre nom ou prénom",
      "contact.phEmail": "vous@entreprise.com",
      "contact.phCompany": "Nom de l'entreprise ou projet",
      "contact.phPhone": "+212 600 000 000",
      "contact.phMessage": "Décrivez votre activité, vos objectifs et vos besoins…",
      "contact.submitBtn": 'Envoyer ma demande <span class="arr">→</span>',
      "contact.formNote": "🔒 Vos informations restent strictement confidentielles. En cliquant sur « Envoyer », vous acceptez d'être recontacté par Jobydoo Agency.",
      "contact.okMsg": "Merci ! Votre message a bien été envoyé. On vous répond très vite sous 24h ouvrées.",
      "contact.waH4": "💬 Réponse instantanée",
      "contact.waP": "Besoin d'un échange direct ? Notre équipe est joignable immédiatement sur WhatsApp pour discuter de votre projet.",
      "contact.waBtn": '<span>Discuter sur WhatsApp</span> <span style="display:inline-block;transition:transform .2s">→</span>',
      "contact.infoEmail": "Email direct",
      "contact.infoPhone": "Téléphone & WhatsApp",
      "contact.infoZone": "Zone d'intervention",
      "contact.infoZoneDesc": "Casablanca, Rabat, Marrakech & tout le Maroc",
      "contact.infoTime": "Délai de réponse",
      "contact.infoTimeDesc": "Sous 24h ouvrées garanti",

      "web.eyebrow": "Création de site web",
      "web.h1": 'Un site web qui <span class="hl">travaille pour vous</span>, pas l\'inverse.',
      "web.sub": 'Sites vitrines, e-commerce et plateformes sur mesure. Design "in motion", expérience mobile irréprochable et SEO technique intégré dès la conception — pour convertir vos visiteurs en clients.',
      "web.ctaBtn": 'Lancer mon site <span class="arr">→</span>',
      "web.ctaGhost": "Voir nos sites",

      "ads.eyebrow": "Media Buying",
      "ads.h1": 'Des campagnes qui <span class="hl">rapportent</span>, pas qui brûlent votre budget.',
      "ads.sub": "Google Ads, Meta Ads et retargeting pilotés par la donnée. On optimise en continu pour baisser votre coût par acquisition et transformer votre trafic en clients.",
      "ads.ctaBtn": 'Lancer mes campagnes <span class="arr">→</span>',
      "ads.ctaGhost": "Voir la prestation",

      "crm.eyebrow": "CRM sur mesure",
      "crm.h1": 'Un CRM qui <span class="hl">pense comme votre équipe</span>.',
      "crm.sub": "Fini les outils génériques mal adaptés. On construit un CRM fait pour VOTRE entreprise : suivi des leads, automatisations et automatisation pour faire le travail répétitif à votre place.",
      "crm.ctaBtn": 'Créer mon CRM <span class="arr">→</span>',
      "crm.ctaGhost": "Voir les modules",

      "crmCustom.eyebrow": "CRM sur mesure au Maroc · Pipeline commercial · Automatisation",
      "crmCustom.h1": 'Un CRM qui <span class="hl">pense comme votre équipe</span>, pas comme un logiciel générique.',
      "crmCustom.sub": "Jobydoo Agency construit un CRM sur mesure au Maroc : pipeline commercial, automatisation des tâches répétitives, suivi clients, intégration WhatsApp Business, et tableaux de bord qui vous donnent le contrôle total sur votre croissance. Pour PME, agences, e-commerce, écoles, immobilier, artisans. Casablanca, Rabat, Marrakech.",
      "crmCustom.ctaBtn": 'Créer mon CRM sur mesure <span class="arr">→</span>',
      "crmCustom.ctaGhost": "Voir les modules",

      "apps.eyebrow": "Applications générales sur mesure · Outils métier · Automatisation",
      "apps.h1": 'Des applications qui <span class="hl">résolvent vos problèmes réels</span>, pas des logiciels génériques.',
      "apps.sub": "Jobydoo Agency, applications générales sur mesure : gestion de stock, gestion commerciale, suivi de production, intégrations Sage 100 Cloud et outils métier spécifiques à votre activité. Pour entreprises et PME au Maroc — Casablanca, Rabat, Marrakech, Tanger, Agadir, partout.",
      "apps.ctaBtn": 'Demander un devis <span class="arr">→</span>',
      "apps.ctaGhost": "Voir les modules",

      "agency.eyebrow": "Agence de communication au Maroc · Communication digitale",
      "agency.h1": 'Une identité qui parle à vos clients — <span class="hl">avant même qu\'ils nous contactent.</span>',
      "agency.sub": "Jobydoo Agency, agence de communication au Maroc : stratégie de marque, contenu web, communication digitale et gestion de réseaux sociaux. Pour que votre entreprise soit perçue comme il se doit — à Casablanca, Rabat, Marrakech et partout au Maroc.",
      "agency.ctaBtn": 'Parler de ma communication <span class="arr">→</span>',
      "agency.ctaGhost": "Voir nos réalisations",

      "about.eyebrow": "À propos",
      "about.h1": 'On a créé Jobydoo pour <span class="hl">simplifier le digital</span> des entreprises.',
      "about.sub": "Trop d'entreprises jonglent avec des prestataires disjoints et des outils qui coûtent cher en temps. Nous réunissons site web, acquisition et CRM en un seul partenaire utile.",

      "faq.eyebrow": "FAQ",
      "faq.h1": 'Tout ce qu\'on est <span class="hl">souvent interrogé</span>.',
      "faq.sub": "Création de site web, media buying, CRM, automatisation et e-commerce au Maroc : les réponses claires, sans jargon, sans engagement."
    },
    en: {
      "nav.home": "Home",
      "nav.web": "Website Creation",
      "nav.ads": "Media Buying",
      "nav.crm": "Custom CRM",
      "nav.apps": "Custom Apps",
      "nav.agency": "Communication Agency",
      "nav.pricing": "Pricing",
      "nav.portfolio": "Portfolio",
      "nav.about": "About Us",
      "nav.faqs": "FAQ",
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
      "footer.sub": "Web Agency · Media Buying · CRM — Morocco",

      "portfolio.eyebrow": "Portfolio & Case Studies · Morocco Web Agency",
      "portfolio.h1": 'Our <span class="hl">projects</span>, measurable results.',
      "portfolio.sub": "Explore our websites, ad campaigns, and custom CRMs engineered to scale our clients across Morocco and internationally.",
      "portfolio.stat1": "Delivered projects & clients",
      "portfolio.stat2": "Average client growth",
      "portfolio.stat3": "Average page load speed",
      "portfolio.stat4": "On-time delivery rate",
      "portfolio.featEyebrow": "Flagship Case Study",
      "portfolio.featTitle": "MoroccoDesertTrips.com — Web Showcase, UX & Direct Bookings",
      "portfolio.featDesc": "Built an ultra-fast web platform dedicated to Moroccan Sahara tourism: direct booking funnel, multilingual SEO, and automated WhatsApp follow-ups.",
      "portfolio.featBtn": "Visit moroccodeserttrips.com ↗",
      "portfolio.filterAll": "All Projects",
      "portfolio.filterTourism": "Tourism & Travel",
      "portfolio.filterLuxury": "Luxury & VIP",
      "portfolio.filterTech": "Tech & E-commerce",
      "portfolio.filterCrm": "CRM & Automation",
      "portfolio.filterB2b": "B2B Services",
      "portfolio.searchPlaceholder": "Search by client, skill, location...",
      "portfolio.gridEyebrow": "Projects & Partners",
      "portfolio.gridTitle": "All Client Projects We Have Scaled",
      "portfolio.gridLead": "Filter by industry sector or use instant search to explore our recent work.",
      "portfolio.visitBtn": "Visit website",
      "portfolio.emptyTitle": "No projects found",
      "portfolio.emptyDesc": "No client matched your current search. Try another keyword or reset your filters.",
      "portfolio.emptyReset": "Reset filters",

      "pricing.eyebrow": "Transparent Pricing & Fast Delivery · Full Clarity",
      "pricing.h1": 'Competitive pricing, <span class="hl">lightning-fast delivery.</span>',
      "pricing.sub": "We streamlined our processes to deliver premium web and software solutions in Morocco with no delays and transparent, upfront pricing.",
      "pricing.ctaBtn": 'Request an Express Quote <span class="arr">→</span>',
      "pricing.ctaGhost": "View Plans & Rates",
      "pricing.gridEyebrow": "2026 Pricing & Turnaround",
      "pricing.gridTitle": "Tailored packages with guaranteed delivery",
      "pricing.gridLead": "Explore our cost-effective pricing tiers and expedited realization times to get online in just a few days.",
      "p1.title": "Business Showcase Website",
      "p1.desc": "Modern 3 to 5 pages site, motion UX design, fully responsive mobile, contact form & baseline Google SEO.",
      "p1.price": "~ 3,500 – 8,500 MAD",
      "p1.time": "⏱️ Delivery: 3 to 5 business days",
      "p2.title": "E-Commerce Online Store",
      "p2.desc": "Complete online boutique, product catalog, CMI card/Stripe/Cash payments, order management & direct WhatsApp.",
      "p2.price": "~ 8,500 – 18,500 MAD",
      "p2.time": "⏱️ Delivery: 7 to 12 business days",
      "p3.title": "Blog & SEO Content Engine",
      "p3.desc": "Fast headless CMS blog setup, content strategy & copywriting optimized to rank your business on Google.",
      "p3.price": "~ 2,500 – 6,500 MAD",
      "p3.time": "⏱️ Delivery: 3 to 5 business days",
      "p4.title": "Media Buying (Google & Meta Ads)",
      "p4.desc": "Strategic ad campaigns management, lower cost per lead (CPL), weekly KPI reporting & continuous ROI tuning.",
      "p4.price": "~ 1,800 – 5,500 MAD / month",
      "p4.time": "⚡ Launch: 48h to 72h",
      "p5.title": "Custom CRM (SMBs & Real Estate)",
      "p5.desc": "Centralized WhatsApp/web lead capture, visual deal pipeline, automated follow-ups & zero recurring software fees.",
      "p5.price": "~ 7,500 – 18,000 MAD",
      "p5.time": "⏱️ Delivery: 7 to 14 business days",
      "p6.title": "Custom Apps & ERP Connectors",
      "p6.desc": "Inventory management tools, B2B client portals & custom API connectors for Sage 100 ERP.",
      "p6.price": "~ 9,500 – 28,000 MAD",
      "p6.time": "⏱️ Deployment: 10 to 20 days",
      "p7.title": "Maintenance & Support",
      "p7.desc": "Regular automated backups, security patches, 24/7 uptime monitoring & priority support.",
      "p7.price": "~ 800 – 2,200 MAD / month",
      "p7.time": "⚡ Continuous support",
      "p8.title": "Digital Audit & Strategy",
      "p8.desc": "Comprehensive assessment of your current website, advertising funnels & conversion rates with immediate action plan.",
      "p8.price": "Complimentary (or 1,200 MAD deep-dive)",
      "p8.time": "⚡ Immediate kickoff",
      "pricing.faqEyebrow": "Frequently Asked Questions",
      "pricing.faqTitle": "Pricing & Delivery — FAQ",
      "pricing.ctaH2": "Have a project or a budget in mind?",
      "pricing.ctaP": "Get a detailed quote and turnaround schedule within 24 business hours.",
      "pricing.ctaBtn2": 'Request My Express Quote <span class="arr">→</span>',

      "contact.eyebrow": "Contact · Free Quote",
      "contact.h1": 'Let\'s talk about your <span class="hl">project</span>.',
      "contact.sub": "Tell us about your business, repetitive tasks, and growth targets. We will get back to you with a clear, no-obligation proposal.",
      "contact.formEyebrow": "Drop Us a Line",
      "contact.formH2": "Request a Free Quote",
      "contact.formLead": "Fill in the form — you will receive a transparent proposal within 24 business hours.",
      "contact.lblName": "Full Name *",
      "contact.lblEmail": "Work Email *",
      "contact.lblCompany": "Company / Project",
      "contact.lblPhone": "Phone / WhatsApp",
      "contact.lblService": "Desired Service",
      "contact.lblMessage": "Project Description *",
      "contact.phName": "Your full name",
      "contact.phEmail": "you@company.com",
      "contact.phCompany": "Company or project name",
      "contact.phPhone": "+212 600 000 000",
      "contact.phMessage": "Describe your activity, your objectives, and your project needs…",
      "contact.submitBtn": 'Send My Request <span class="arr">→</span>',
      "contact.formNote": "🔒 Your information remains strictly confidential. By clicking 'Send', you agree to be contacted by Jobydoo Agency.",
      "contact.okMsg": "Thank you! Your message has been sent successfully. We will reply within 24 business hours.",
      "contact.waH4": "💬 Instant Response",
      "contact.waP": "Need a quick discussion? Our team is available directly on WhatsApp to discuss your project.",
      "contact.waBtn": '<span>Chat on WhatsApp</span> <span style="display:inline-block;transition:transform .2s">→</span>',
      "contact.infoEmail": "Direct Email",
      "contact.infoPhone": "Phone & WhatsApp",
      "contact.infoZone": "Coverage Area",
      "contact.infoZoneDesc": "Casablanca, Rabat, Marrakech & all Morocco",
      "contact.infoTime": "Response Time",
      "contact.infoTimeDesc": "Guaranteed within 24 business hours",

      "web.eyebrow": "Website Creation · Modern UX · Morocco",
      "web.h1": 'A website that <span class="hl">works for you</span>, not against you.',
      "web.sub": "Showcase websites, e-commerce stores, and bespoke platforms. Motion UX design, flawless mobile responsiveness, and technical SEO from day one — engineered to turn visitors into paying clients.",
      "web.ctaBtn": 'Launch My Website <span class="arr">→</span>',
      "web.ctaGhost": "View Our Portfolio",

      "ads.eyebrow": "Media Buying · Google & Meta Ads",
      "ads.h1": 'Ad campaigns that <span class="hl">generate profit</span>, not waste your budget.',
      "ads.sub": "Data-driven Google Ads, Meta Ads, and retargeting. We continuously optimize to lower your customer acquisition cost (CAC) and turn traffic into predictable sales.",
      "ads.ctaBtn": 'Launch My Campaigns <span class="arr">→</span>',
      "ads.ctaGhost": "Explore Services",

      "crm.eyebrow": "Custom CRM & Sales Automation",
      "crm.h1": 'A CRM that <span class="hl">thinks like your team</span>.',
      "crm.sub": "No more rigid, generic tools that nobody uses. We build a CRM tailored to YOUR business: lead centralization, sales pipeline, and automated follow-ups via WhatsApp and email.",
      "crm.ctaBtn": 'Build My CRM <span class="arr">→</span>',
      "crm.ctaGhost": "View Modules",

      "crmCustom.eyebrow": "Custom CRM in Morocco · Sales Pipeline · Automation",
      "crmCustom.h1": 'A CRM that <span class="hl">thinks like your team</span>, not like a generic spreadsheet.',
      "crmCustom.sub": "Jobydoo Agency builds custom CRMs in Morocco: visual sales pipeline, routine task automation, customer follow-ups, WhatsApp Business integration, and clear analytics dashboards for full growth visibility.",
      "crmCustom.ctaBtn": 'Build My Custom CRM <span class="arr">→</span>',
      "crmCustom.ctaGhost": "View Modules",

      "apps.eyebrow": "Custom Business Apps · ERP Tools · Automation",
      "apps.h1": 'Applications that <span class="hl">solve real operational bottlenecks</span>, not generic bloatware.',
      "apps.sub": "Jobydoo Agency designs bespoke business applications: inventory management, sales invoicing, field operations, and custom Sage 100 Cloud API bridges tailored for Moroccan companies.",
      "apps.ctaBtn": 'Request a Quote <span class="arr">→</span>',
      "apps.ctaGhost": "View Modules",

      "agency.eyebrow": "Communication Agency in Morocco · Digital Branding",
      "agency.h1": 'A brand identity that speaks to your clients — <span class="hl">before they even contact you.</span>',
      "agency.sub": "Jobydoo Agency: strategic branding, high-converting copywriting, digital communication, and social media management to ensure your business is recognized as a market leader across Morocco.",
      "agency.ctaBtn": 'Discuss My Brand Strategy <span class="arr">→</span>',
      "agency.ctaGhost": "View Our Portfolio",

      "about.eyebrow": "About Us",
      "about.h1": 'We built Jobydoo to <span class="hl">simplify digital growth</span> for businesses.',
      "about.sub": "Too many businesses juggle disconnected agencies and tools that drain time and capital. We unite web development, client acquisition, and CRM under one effective, reliable partner.",

      "faq.eyebrow": "FAQ",
      "faq.h1": 'Everything you need to know, <span class="hl">clearly answered</span>.',
      "faq.sub": "Website creation, media buying, custom CRM, workflow automation, and e-commerce in Morocco: transparent answers, no jargon, no commitment."
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

    // Update placeholders with data-i18n-ph
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key = el.getAttribute("data-i18n-ph");
      if(I18N[lang] && I18N[lang][key]){
        el.setAttribute("placeholder", I18N[lang][key]);
      }
    });

    // Update select options if on contact page
    var servSelect = document.getElementById("service");
    if(servSelect){
      var opts = lang === "en" ? [
        "Website Creation",
        "Media Buying (Paid Ads)",
        "Custom CRM & Automation",
        "Custom Applications / ERP",
        "Communication Agency",
        "Other / Full Project"
      ] : [
        "Création de site web",
        "Media Buying (Publicités Ads)",
        "CRM sur mesure & Automatisation",
        "Applications générales",
        "Agence de communication globale",
        "Autre / Projet complet"
      ];
      servSelect.querySelectorAll("option").forEach(function(opt, idx){
        if(opts[idx]) opt.textContent = opts[idx];
      });
    }

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

    ensureWhatsAppButton();
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

    // Initialize current language state on page load
    applyLanguage(currentLang);

  /* WhatsApp Floating Button (+212645833671) */
  function ensureWhatsAppButton(){
    var wa = document.querySelector(".whatsapp-float");
    if(!wa){
      wa = document.createElement("a");
      wa.className = "whatsapp-float";
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.setAttribute("aria-label", "WhatsApp +212645833671");
      document.body.appendChild(wa);
    }
    var msg = currentLang === "en"
      ? "Hello Jobydoo Agency, I would like a quote for my project."
      : "Bonjour Jobydoo Agency, je souhaite un devis pour mon projet.";
    var btnText = currentLang === "en" ? "Chat on WhatsApp" : "Discuter sur WhatsApp";
    wa.href = "https://wa.me/212645833671?text=" + encodeURIComponent(msg);
    wa.title = currentLang === "en" ? "Chat on WhatsApp (+212 645 833 671)" : "Discuter sur WhatsApp (+212 645 833 671)";
    wa.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.58.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/></svg><span class="wa-text">' + btnText + '</span>';
  }

  /* =====================================================================
   * Portfolio Live Filter & Instant Search (0-latency Vanilla JS)
   * ===================================================================== */
  var portfolioGrid = document.querySelector(".client-grid");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var searchInput = document.getElementById("portfolioSearch");
  var countDisplay = document.getElementById("visibleCount");
  var totalCountDisplay = document.getElementById("totalCount");
  var emptyState = document.querySelector(".portfolio-empty");
  var resetFiltersBtn = document.getElementById("resetFiltersBtn");

  if(portfolioGrid && filterButtons.length){
    var activeCategory = "all";
    var currentSearch = "";
    var cards = Array.from(portfolioGrid.querySelectorAll(".client-card"));

    function updatePortfolioDisplay(){
      var visibleCount = 0;
      var query = currentSearch.toLowerCase().trim();

      cards.forEach(function(card){
        var cat = card.getAttribute("data-cat") || "";
        var cats = cat.split(" ");
        var cardText = (card.textContent || "").toLowerCase();

        var matchesCat = (activeCategory === "all") || (cats.indexOf(activeCategory) !== -1);
        var matchesSearch = !query || (cardText.indexOf(query) !== -1);

        if(matchesCat && matchesSearch){
          card.classList.remove("is-hidden");
          visibleCount++;
        } else {
          card.classList.add("is-hidden");
        }
      });

      if(countDisplay) countDisplay.textContent = visibleCount;
      if(totalCountDisplay) totalCountDisplay.textContent = cards.length;

      if(emptyState){
        if(visibleCount === 0){
          emptyState.classList.add("visible");
        } else {
          emptyState.classList.remove("visible");
        }
      }
    }

    filterButtons.forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        filterButtons.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-filter") || "all";
        updatePortfolioDisplay();
      });
    });

    if(searchInput){
      searchInput.addEventListener("input", function(e){
        currentSearch = e.target.value;
        updatePortfolioDisplay();
      });
    }

    if(resetFiltersBtn){
      resetFiltersBtn.addEventListener("click", function(e){
        e.preventDefault();
        if(searchInput) searchInput.value = "";
        currentSearch = "";
        activeCategory = "all";
        filterButtons.forEach(function(b){
          b.classList.toggle("active", b.getAttribute("data-filter") === "all");
        });
        updatePortfolioDisplay();
      });
    }

    // Initialize counts
    updatePortfolioDisplay();
  }

  // Initial apply
  applyLanguage(currentLang);
  ensureWhatsAppButton();
})();

