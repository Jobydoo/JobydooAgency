import subprocess, sys, os

# OS-safe temp path
tmpdir = os.environ.get("TEMP", os.environ.get("TMP", "/tmp"))
script_path = os.path.join(tmpdir, "hermes-verify-jobydoo.py")

code = r'''
import subprocess, sys

BASE = "https://www.jobydooagency.com"
errors = []

def fetch(url, max_bytes=15000):
    try:
        r = subprocess.run(["curl","-sL","-r","0-"+str(max_bytes),"--max-time","6",
            "-H","User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            url], capture_output=True, text=True, timeout=10)
        return r.stdout
    except:
        return ""

def http_code(url):
    try:
        r = subprocess.run(["curl","-sL","-o","/dev/null","-w","%{http_code}","--max-time","6",
            "-H","User-Agent: Mozilla/5.0",url], capture_output=True, text=True, timeout=8)
        return r.stdout.strip()
    except:
        return "000"

print("="*60)
print("  JOBYDOO AGENCY — VÉRIFICATION POST-DÉPÔT")
print("="*60)
print()

print("1. Pages déployées (HTTP 200):")
pages = ["index.html","creation-site-web.html","media-buying.html",
         "creation-crm.html","applications-general.html","portfolio.html",
         "contact.html","faqs.html"]
for p in pages:
    code = http_code(f"{BASE}/{p}")
    ok = "✅" if code == "200" else "❌"
    print(f"  {ok} {p}: {code}")
    if code != "200":
        errors.append(f"HTTP {code} pour {p}")
print()

print("2. faqs.html — contenu clé:")
faq = fetch(f"{BASE}/faqs.html")
faq_items = [
    ("Sage 100 Cloud", "mention Sage 100 Cloud"),
    ("combien coûte la création d'un site web au Maroc", "prix création site web"),
    ("Qu'est-ce qu'un CRM", "définition CRM"),
    ("What does a CRM system do", "fonction CRM (EN)"),
    ("Comment lancer un site e-commerce au Maroc", "e-commerce maroc"),
    ("Amazon livre au Maroc", "Amazon au Maroc"),
    ("marketing agency morocco", "marketing agency morocco"),
    ("agence de communication au maroc", "agence communication maroc"),
    ("digital agency morocco", "digital agency morocco"),
    ("digital marketing agency morocco", "digital marketing agency morocco"),
]
for kw, label in faq_items:
    if kw.lower() in faq.lower():
        print(f"  ✅ {label}")
    else:
        print(f"  ❌ {label}")
        errors.append(f"faqs.html: manque '{label}'")
print()

print("3. creation-site-web.html — FAQ integrée:")
csw = fetch(f"{BASE}/creation-site-web.html")
if "Combien coûte la création" in csw or "Combien coute la creation" in csw:
    print("  ✅ Section FAQ création site web présente")
else:
    print("  ❌ FAQ création site web ABSENTE")
    errors.append("creation-site-web: FAQ absente")
if "faqs.html" in csw:
    print("  ✅ Lien vers faqs.html présent")
else:
    print("  ❌ Lien faqs.html ABSENT")
    errors.append("creation-site-web: lien faqs.html absent")
print()

print("4. media-buying.html — FAQ integrée:")
mb = fetch(f"{BASE}/media-buying.html")
if "faqs.html" in mb:
    print("  ✅ Lien faqs.html présent")
else:
    print("  ❌ Lien faqs.html ABSENT")
    errors.append("media-buying: lien faqs.html absent")
if "Amazon" in mb and "livre au Maroc" in mb:
    print("  ✅ FAQ e-commerce/Amazon présente")
else:
    print("  ❌ FAQ e-commerce/Amazon ABSENTE")
    errors.append("media-buying: FAQ e-commerce absente")
print()

print("5. portfolio.html — sites ajoutés:")
port = fetch(f"{BASE}/portfolio.html")
for site in ["lesamisdusahara.com", "protectcamevents.com"]:
    count = port.count(site)
    if count > 0:
        print(f"  ✅ {site}: {count} occurrence(s)")
    else:
        print(f"  ❌ {site}: ABSENT")
        errors.append(f"portfolio: {site} absent")
if "applications-general.html" in port:
    print("  ✅ applications-general.html dans footer")
else:
    print("  ❌ applications-general.html ABSENT footer")
    errors.append("portfolio: app-gen absent")
print()

print("6. index.html — keywords visibles:")
idx = fetch(f"{BASE}/index.html")
kw_main = ["agence web maroc","marketing agency morocco","agence de communication",
           "digital maroc","maroc digital","CRM sur mesure","media buying"]
for kw in kw_main:
    if kw.lower() in idx.lower():
        print(f"  ✅ '{kw}'")
    else:
        print(f"  ❌ '{kw}'")
        errors.append(f"index: manque '{kw}'")
print()

print("7. Google Search Console verification:")
for fname in ["google37e08f16ab58608a.html"]:
    content = fetch(f"{BASE}/{fname}", 1000)
    if "google-site-verification" in content:
        print(f"  ✅ {fname}: google-site-verification présent")
    else:
        print(f"  ❌ {fname}: verification ABSENTE")
        errors.append(f"GSC: {fname} absent")
print()

print("="*60)
if errors:
    print(f"❌ {len(errors)} problème(s):")
    for e in errors:
        print(f"   - {e}")
    sys.exit(1)
else:
    print("✅ TOUT EST CONFIRMÉ — déploiement Vercel OK, tout le contenu en place")
'''

with open(script_path, 'w', encoding='utf-8') as f:
    f.write(code)

print(f"Script écrit: {script_path}")
result = subprocess.run(
    ["/c/Users/hp/AppData/Local/hermes/bin/uv", "run", "--python", "3.13", "python", script_path],
    capture_output=True, text=True, timeout=120, cwd="/c/Users/hp/jobydoo-agency"
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[:500])
print("Exit:", result.returncode)
