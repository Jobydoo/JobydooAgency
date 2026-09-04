import os, sys, re

BASE = "."  # dossier courant = jobydoo-agency

# Liste des mots-clé à supprimer (hors sujet)
REMOVE = [
    "does amazon deliver in morocco",
    "does amazon deliver to morocco", 
    "does amazon ship to morocco",
    "does amazon work in morocco",
    "does ebay ship to morocco",
    "does ebay deliver to morocco",
    "does ebay work in morocco",
    "is amazon available in morocco",
    "is amazon in morocco",
    "is there amazon in morocco",
    "can i buy from amazon in morocco",
    "can i buy from amazon morocco",
    "can you order amazon in morocco",
    "how to start e-commerce business morocco",
    "how to start e-commerce in morocco",
    "how to start e commerce business morocco",
    "how to start ecommerce business morocco",
    "how to sell online in morocco",
    "how to dropship using a moroccan address",
    "how to dropship with a moroccan address",
    "how to open an internet dropshipping business in morocco",
    "how to set up online store with a moroccan address",
    "how to buy from amazon from morocco",
    "how to call ebay from morocco",
    "how much does marketing and advertising in morocco cost",
    "how much is a marketing campaign cost in morocco",
    "how to start an internet dropshipping business in morocco",
    "marketing digital abidjan",
    "agence marketing digital dakar",
]

print("=" * 60)
print("Nettoyage des mots-clé hors-sujet dans les meta keywords")
print("=" * 60)

for fname in ["index.html", "creation-site-web.html", "faqs.html", 
               "portfolio.html", "contact.html", "applications-general.html",
               "media-buying.html", "a-propos.html", "creation-crm.html"]:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f"  [{fname}] Fichier non trouvé")
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_len = len(content)
    
    # Extraire le bloc meta keywords
    kw_match = re.search(r'(<meta name="keywords" content=")([^"]*)(")', content)
    if not kw_match:
        print(f"  [{fname}] Pas de balise meta keywords trouvée")
        continue
    
    prefix, keywords_str, suffix = kw_match.group(1), kw_match.group(2), kw_match.group(3)
    
    # Transformer en liste et filtrer
    kw_list = [k.strip() for k in keywords_str.split(',')]
    original_count = len(kw_list)
    cleaned = [k for k in kw_list if k.lower() not in [r.lower() for r in REMOVE]]
    removed = original_count - len(cleaned)
    
    if removed > 0:
        # Reconstruire la chaîne
        new_kw_str = ", ".join(cleaned)
        new_content = content.replace(keywords_str, new_kw_str)
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [{fname}] Supprimé {removed} mot(s)-clé hors-sujet "
              f"({original_count} → {len(cleaned)} total)")
    else:
        print(f"  [{fname}] Aucun mot-clé hors-sujet trouvé")

print()
print("Nettoyage terminé.")
