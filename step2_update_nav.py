import os, sys

BASE = "/c/Users/hp/jobydoo-agency"

# Pages à mettre à jour avec le nouveau menu (CRM sur mesure + agence-communication)
pages_with_nav = [
    "index.html",
    "a-propos.html",
    "contact.html",
    "portfolio.html",
    "media-buying.html",
    "agence-communication.html",
    "crm-sur-mesure.html",
    "applications-general.html",
]

new_menu_items = [
    '      <li><a href="index.html">Accueil</a></li>',
    '      <li><a href="creation-site-web.html">Création de site web</a></li>',
    '      <li><a href="media-buying.html">Media Buying</a></li>',
    '      <li><a href="creation-crm.html">CRM sur mesure</a></li>',
    '      <li><a href="crm-sur-mesure.html">CRM sur mesure</a></li>',
    '      <li><a href="applications-general.html">Applications générales</a></li>',
    '      <li><a href="agence-communication.html">Agence de communication</a></li>',
    '      <li><a href="portfolio.html">Portfolio</a></li>',
    '      <li><a href="a-propos.html">À propos</a></li>',
    '      <li><a href="contact.html">Contact</a></li>',
]

# Mots-clé à retirer des descriptions et titres (fo
...[truncated]