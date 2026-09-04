import os, sys

BASE = "/c/Users/hp/jobydoo-agency"

print("=" * 60)
print("ÉTAPE 2 : Mise à jour des menus nav (CRM sur mesure + agence-communication)")
print("=" * 60)

# Pages à mettre à jour
pages_to_update = [
    "index.html",
    "a-propos.html", 
    "contact.html",
    "portfolio.html",
    "media-buying.html",
]

for fname in pages_to_update:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f"  [{fname}] Fichier non trouvé, ignoré")
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remplacer le menu CRM sur mesure pour inclure crm-sur-mesure.html
    # old: <li><a href="creation-crm.html">CRM sur mesure</a></li>
    # new:  <li><a href="creation-crm.html">CRM sur mesure</a></li>\n      <li><a href="crm-sur-mesure.html">CRM sur mesure</a></li>
    if '<li><a href="creation-crm.html">CRM sur mesure</a></li>' in content:
        new_content = content.replace(
            '<li><a href="creation-crm.html">CRM sur mesure</a></li>',
            '      <li><a href="creation-crm.html">CRM sur mesure</a></li>\n      <li><a href="crm-sur-mesure.html">CRM sur mesure</a></li>'
        )
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  [{fname}] Menu mis à jour : ajout de crm-sur-mesure.html")
        else:
            print(f"  [{fname}] Aucun changement nécessaire (menu déjà à jour)")

print()
print("Mise à jour des menus terminée.")
