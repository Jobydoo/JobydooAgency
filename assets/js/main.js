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
    burger.addEventListener("click", function(){
      navLinks.classList.toggle("open");
      burger.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ navLinks.classList.remove("open"); });
    });
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

  /* Contact form (no backend: shows confirmation + mailto fallback) */
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
      var subject = encodeURIComponent("Nouvelle demande Jobydoo — " + (data.get("service")||"Contact"));
      var body = encodeURIComponent("Nom: " + name + "\nEmail: " + email + "\nSociété: " + (data.get("company")||"—") + "\nService: " + (data.get("service")||"—") + "\n\nMessage:\n" + msg);
      var ok = document.getElementById("formOk");
      if(ok) ok.style.display = "block";
      form.reset();
      // open mail client as a real delivery path
      window.location.href = "mailto:contact@jobydooagency.com?subject=" + subject + "&body=" + body;
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
})();
