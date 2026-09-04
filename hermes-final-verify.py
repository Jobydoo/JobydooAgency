import subprocess, re, sys

BASE = "https://www.jobydooagency.com"
errors = []

def http(url):
    try:
        out = subprocess.run(["curl","-sL","-o","/dev/null","-w","%{http_code}","--max-time","8","-H","User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)",url],capture_output=True,text=True,timeout=15).stdout.strip()
        return int(out) if out.isdigit() else None
    except:
        return None

def fetch(url):
    try:
        out = subprocess.run(["curl","-sL","-r","0-20000","--max-time","8","-H","User-Agent: Mozilla/5.0",url],capture_output=True,text=True,timeout=15).stdout
        return out
    except:
        return ""

print("=== JOBYDOO AGENCY — VÉRIFICATION FINALE ===\n")

pages = ["index.html","creation-site-web.html","media-buying.html","creation-crm.html","applications-general.html","portfolio.html","contact.html","faqs.html"]
print("--- Pages déployées ---")
for p in pages:
    code = http(f"{BASE}/{p}")
    ok = "✅" if code == 200 else "❌"
    print(f"  {ok} {p}: {code}")
    if code != 200: errors.append(f"{p} retourne {code}")
print()

# Google Search Console verification files
print("--- Google Search Console verification files ---")
for fname in ["google37e08f16ab58608a.html","google37e08f16ab58608a (1).html"]:
    try:
        out = subprocess.run(["curl","-sL","--max-time","5",f"{BASE}/{fname}"],capture_output=True,text=True,timeout=10).stdout
        if "google-site-verification" in out:
            print(f"  ✅ {fname} présent et valide")
        else:
            print(f"  ❌ {fname} absent du site")
            errors.append(f"{fname} absent du site")
    except:
        print(f"  ❌ {fname} erreur de vérification")
print()

# FAQ page content
print("--- FAQ page (faqs.html) content check ---")
faq = fetch(f"{BASE}/faqs.html")
faq_checks = {
    "Sage 100 Cloud": "faq mentionne Sage 100 Cloud?",
    "combien cout de creation site web maroc": "FAQ: prix création site web",
    "comment chercher des clint": "FAQ: trouver clients",
    "qu'est-ce qu'un crm system": "FAQ: qu'est-ce qu'un CRM",
    "what does a crm system do": "FAQ: fonction CRM",
    "comment lancer un site e-commerce au maroc": "FAQ: lancement e-commerce",
    "agence web maroc": "FAQ: mot-clé principal",
    "marketing agency morocco": "FAQ: mot-clé anglais",
    "digital agency morocco": "FAQ: mot-clé digital",
}
for kw, label in faq_checks.items():
    if kw.lower() in faq.lower():
        print(f"  ✅ {label}")
    else:
        print(f"  ❌ {label} — '{kw}' absent")
        errors.append(f"FAQ: {label}")
print()

# creation-site-web FAQ section
print("--- creation-site-web.html: FAQ section present? ---")
csw = fetch(f"{BASE}/creation-site-web.html")
if "Combien coûte la création d'un site web au Maroc" in csw:
    print("  ✅ Section FAQ création de site web présente")
else:
    print("  ❌ Section FAQ création de site web ABSENTE")
    errors.append("FAQ absent de creation-site-web.html")
if "faqs.html" in csw:
    print("  ✅ Lien vers faqs.html présent")
else:
    print("  ❌ Lien vers faqs.html ABSENT")
    errors.append("Lien faqs.html absent de creation-site-web.html")
print()

# media-buying FAQ section  
print("--- media-buying.html: FAQ section present? ---")
mb = fetch(f"{BASE}/media-buying.html")
if "Comment lancer un site e-commerce au Maroc" in mb:
    print("  ✅ FAQ e-commerce présente dans media-buying")
else:
    print("  ❌ FAQ e-commerce ABSENTE de media-buying")
    errors.append("FAQ e-commerce absente de media-buying.html")
if "faqs.html" in mb:
    print("  ✅ Lien vers faqs.html présent")
else:
    print("  ❌ Lien vers faqs.html ABSENT")
    errors.append("Lien faqs.html absent de media-buying.html")
print()

# Portfolio checks  
print("--- Portfolio checks ---")
portfolio = fetch(f"{BASE}/portfolio.html")
for site in ["lesamisdusahara.com","protectcamevents.com"]:
    if site in portfolio:
        print(f"  ✅ {site} présent dans le portfolio")
    else:
        print(f"  ❌ {site} ABSENT du portfolio")
        errors.append(f"{site} absent")
if "applications-general.html" in portfolio:
    print("  ✅ applications-general.html dans footer portfolio")
else:
    print("  ❌ applications-general.html ABSENT du footer portfolio")
    errors.append("applications-general.html absent portfolio footer")
print()

# Keywords presence across all pages
print("--- Keywords répartis sur toutes les pages ---")
keywords = ["agence web maroc","marketing agency morocco","agence de communication au maroc",
            "agences de communication au maroc","agence communication maroc","agence de communication rabat",
            "agence de marketing digital casablanca","agence digital marketing casablanca",
            "agence digital rabat","agence marketing digital casablanca","agence marketing digital rabat",
            "agence marketing digitale casablanca","agenz maroc","digipark casablanca maroc",
            "digital agency morocco","digital marketing agency casablanca","digital marketing agency morocco",
            "digital marketing casablanca","digital marketing morocco","digital maroc","digital morocco",
            "digital morocco 2030","digital morocco 2030 strategy","digital products maroc","maracodigital",
            "marketing casablanca","marketing digital casablanca","marketing in morocco","maroc digital",
            "maroc digital 2030","morocco digital","morocco digital 2030","morocco digital transformation",
            "agence digital marketing maroc","agence digitale casablanca maroc","agence site web maroc",
            "agence webmarketing maroc","agences de communication casablanca","agences de communication rabat",
            "casablanca agence de communication","digital agency casablanca","digital casablanca",
            "digital marketing agencies morocco","digital marketing agency maroc","digital marketing in morocco",
            "email marketing maroc","gestion de publicité en ligne maroc","le marketing digital au maroc",
            "marketing agency casablanca","marketing agency maroc","marketing digital au maroc","marketing maroc",
            "maroc digital 2030 strategy","morocco digital strategy 2030","morocco digital transformation hub",
            "online presence marketing strategy morocco 2026","publicité en ligne pour startups maroc",
            "pulse digital maroc","web agency maroc","www.agencemanage.ma","add digital maroc"
]
for kw in keywords:
    found = []
    for p in pages:
        h = fetch(f"{BASE}/{p}")
        if kw.lower() in h.lower():
            found.append(p)
    if len(found) > 0:
        print(f"  ✅ '{kw}' → {len(found)} pages")
    else:
        print(f"  ❌ '{kw}' → absente de toutes les pages")
        errors.append(f"Keyword '{kw}' absent de toutes les pages")
print()

print("=== RÉSULTAT ===")
if errors:
    print(f"\n❌ {len(errors)} problème(s):")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
else:
    print("\n✅ TOUT EST BON — toutes les vérifications passées")
