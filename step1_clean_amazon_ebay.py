import os, sys, re

# Utiliser le répertoire courant
BASE = os.path.dirname(os.path.abspath(__file__)) or "."

print("=" * 60)
print("NETTOYAGE : Suppression des mots-clé hors sujet (Amazon/eBay/dropshipping)")
print(f"Répertoire : {BASE}")
print("=" * 60)

keywords_to_remove = [
    "does amazon deliver in morocco",
    "does aws deliver to morocco",
    "does amazon ship to morocco",
    "does amazon work in morocco",
    "does ebay ship to morocco",
    "does ebay deliver to morocco",
    "does ebay work in morocco",
    "is aws
...[truncated]