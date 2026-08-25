# Jobydoo Agency — Déploiement Vercel & liaison du domaine

Site statique (HTML + CSS + JS). Aucune construction nécessaire : Vercel sert les fichiers directement.

## 1. Préparer le dépôt Git
```bash
cd jobydoo-agency
git init
git add .
git commit -m "Site Jobydoo Agency v1"
# Créez un repo sur GitHub/GitLab, puis :
git remote add origin <votre-repo>
git push -u origin main
```

## 2. Déployer sur Vercel
- Allez sur https://vercel.com → **Add New → Project**
- Importez le dépôt `jobydoo-agency`
- Vercel détecte un projet statique automatiquement (le `vercel.json` est déjà présent)
- **Build Command** : laissez vide (static)
- **Output Directory** : laissez vide (racine)
- Cliquez **Deploy**. En ~30 s vous obtenez une URL `*.vercel.app`.

## 3. Lier le nom de domaine jobydooagency.com
Dans le dashboard Vercel du projet :
1. **Settings → Domains** → ajoutez `jobydooagency.com` et `www.jobydooagency.com`.
2. Vercel vous donne des **enregistrements DNS** à ajouter chez votre registrar (OVH, GoDaddy, etc.) :
   - Type **A** : `@` → `76.76.21.21`
   - Type **CNAME** : `www` → `cname.vercel-dns.com`
3. Ajoutez-les, attendez la propagation (quelques minutes à 24 h).
4. Vercel émet un **certificat SSL** automatique (HTTPS gratuit).

> Astuce : si votre domaine est déjà utilisé ailleurs, supprimez les anciens enregistrements A/CNAME avant d'ajouter ceux de Vercel.

## 4. Vérifications SEO post-déploiement
- [ ] `https://www.jobydooagency.com/` renvoie 200
- [ ] `https://jobydooagency.com/sitemap.xml` accessible
- [ ] `https://jobydooagency.com/robots.txt` pointe vers la sitemap
- [ ] Redirection `http → https` active (Vercel le fait par défaut)
- [ ] Google Search Console : ajoutez le domaine + soumettez la sitemap
- [ ] Remplacez les liens sociaux `#` par vos vrais profils
- [ ] Mettez à jour l'email `contact@jobydooagency.com` et le téléphone dans `contact.html` + footer

## 5. Modifier le contenu
Tout est en HTML dans les fichiers racine. Pour changer un texte, éditez la page concernée
(`index.html`, `creation-site-web.html`, etc.) et redéployez (push Git ou re-import).
Les styles sont dans `assets/css/style.css`, les interactions dans `assets/js/main.js`.

## Structure
```
jobydoo-agency/
├── index.html              # Accueil
├── creation-site-web.html  # Service : site web
├── media-buying.html        # Service : media buying
├── creation-crm.html        # Service : CRM sur mesure
├── portfolio.html           # Portfolio (MoroccoDesertTrips.com)
├── a-propos.html            # À propos
├── contact.html             # Contact (formulaire)
├── 404.html
├── robots.txt
├── sitemap.xml
├── vercel.json
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/  (logo, og, favicon, captures portfolio)
```
