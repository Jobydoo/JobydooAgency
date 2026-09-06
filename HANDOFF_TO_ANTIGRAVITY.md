# Handoff — Jobydoo Agency → Antigravity

> À remettre à Antigravity dès qu'il prend le projet.
> Ce fichier est AUTO-CONTENU : tout ce qu'il faut savoir pour continuer.

---

## 1. Où trouver le projet

**Dossier local (Windows) :**
```
C:\Users\hp\jobydoo-agency
```

**Alternative Git (clone frais) :**
```bash
git clone https://github.com/Jobydoo/JobydooAgency.git
cd JobydooAgency
```

**Site live :** https://www.jobydooagency.com  
**Déploiement :** Git push sur `main` → Vercel rebuild automatique → site mis à jour.

---

## 2. Ce que contient le projet

Dossier complet et fonctionnel (2,1 Mo), 100% HTML/CSS/JS statique, zéro dépendance, zéro build. Antigravity peut l'ouvrir directement.

### Page d'entrée — `index.html` (accueil)
Thème **BRIGHT** (clair, bleu électrique #1e6aff, orange #ff6b35). Page d'accueil allégée : 4 sections seulement — Hero aérien + 4 cartes services + Stats clientèles + Témoignages courts. Vise la première impression client : net, moderne, pas de surcharge.

### Pages secondaires (HTML autonomes)
- `contact.html` — CTA + formulaire (action vers le formulaire sans backend, type FormSubmit)
- `pricing.html` — grille 7 offres avec tarifs en MAD baissés
- `creation-site-web.html`, `media-buying.html`, `creation-crm.html`, `crm-sur-mesure.html`, `agence-communication.html` — fiches prestation
- `portfolio.html` — galerie visuelle (laisses comme c'est)
- `faqs.html` — FAQ tarifaire
- `a-propos.html`, `applications-general.html` — pages génériques à compléter
- `crm-*.html` — sous-pages CRM diverses
- `404.html` — page d'erreur

### Assets
```
assets/
  css/
    style.css        ← thème BRIGHT principal (Jobydoo)
    all-pages.css    ← fallback CSS (certaines pages alternatives)
  js/
    main.js          ← burger mobile + animations + body scroll lock + smooth reveal
  img/               ← logo, favicon, OG image, captures portfolio
```

### Config
- `vercel.json` — config Vercel (single page app routing, headers)
- `sitemap.xml`, `robots.txt`
- `blog/README.md` — plan 5 articles SEO

---

## 3. Ce qu'Antigravity doit SAVOIR avant de toucher

### Identifiants — DONNÉ MAIS PAS STOCKÉ
- **GitHub** : token annulé/à régénérer si besoin (le remote est configuré avec `Jobydoo:ghp_...` mais le token exact n'est pas conservé pour sécurité). Action correcte : générer un nouveau PAT (scope `repo`) dans GitHub → Settings → Developer settings → Personal access tokens, puis `git remote set-url origin https://USER:TOKEN@github.com/Jobydoo/JobydooAgency.git`.
- **Vercel** : se connecter à Vercel (compte existant) et lier le repo GitHub. Déploiement automatique sur push `main`. Le site est déjà configuré sur Vercel — Antigravity n'a qu'à push pour déployer.
- **WordPress (si site) :** utilisateur admin + application password à fournir sur demande.

**Règle : ne jamais stocker ces identifiants dans des fichiers du projet.**

### Ce qui est DÉJÀ fait (ne pas refaire)
- Thème BRIGHT complet (CSS refactorisé, index simplifié)
- Menu burger mobile fonctionnel + body scroll lock + animations reveal
- Header propre : 9 liens, pas de déformation, responsive jusqu'à 480px
- Tarifs pricing harmonisés (site vitrine ~6k-15k MAD, e-com ~15k-35k MAD, CRM ~12k-35k MAD, etc.)
- Suppression page hébergement (`hosting.html`) — plus aucun lien vers elle, sitemap nettoyé
- Footer contact corrigé (inclut lien "Tarifs")
- Pages SEO : titres, meta descriptions, OG tags, schema (LocalBusiness, ProfessionalService)
- Doublon CRM supprimé du menu (création-crm.html conservé, crm-sur-mesure.html retiré des navs)

### Ce qui reste à faire (points ouverts)
- Modifier/augmenter le contenu des pages secondaires (faqs, a-propos, applications, crm-* selon besoins)
- Peupler le blog (5 articles planifiés dans `blog/README.md`)
- Intégrer le formulaire de contact avec un vrai service (FormSubmit.co configuré, ID du site à vérifier)
- SEO avancé si demandé (ajout de microdonnées, optimisation images, etc.)
- Responsive fine-tuning si besoin (la page d'accueil est conçue mobile-first, à vérifier sur devices réels)

### Point de départ recommandé pour Antigravity
1. Ouvrir le dossier `C:\Users\hp\jobydoo-agency`
2. Lire `index.html` (page d'accueil) + `style.css` (thème BRIGHT)
3. Lire `contact.html` (formulaire CTA)
4. Vérifier le site live : https://www.jobydooagency.com
5. Lire ce fichier README (`HANDOFF_TO_ANTIGRAVITY.md`) pour comprendre le contexte
6. Commencer par ce qui est demandé + respecter la direction BRIGHT/épurée déjà en place

---

## 4. Comment déployer (si Antigravity fait des modifications)

```bash
cd /c/Users/hp/jobydoo-agency   (ou le dossier clone)
git add .
git commit -m "ce que j'ai fait"
git push origin main
```

Sur Vercel, ça rebuild automatiquement. Attendre ~1-2 min, puis vérifier le site live.

---

## 5. Points d'attention

- **Ne pas revenir au thème sombre** — la direction claire/lumineuse est la décision active.
- **Garder la page d'accueil légère** — max 4-5 sections, pas de surcharge.
- **Ne pas ajouter de dépendances** (jQuery, framework CSS, etc.) — tout est vanilla HTML/CSS/JS.
- **Vérifier le live après chaque push** — https://www.jobydooagency.com

---

*Fichier généré le 2026-09-06. À remettre à Antigravity au handoff.*
