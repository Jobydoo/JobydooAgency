import os
import re
import subprocess
import sys

BASE = "/c/Users/hp/jobydoo-agency"
html_files = [
    "index.html",
    "creation-site-web.html",
    "faqs.html",
    "a-propos.html",
    "contact.html",
    "portfolio.html",
    "media-buying.html",
    "agence-communication.html",
    "crm-sur-mesure.html",
    "applications-general.html",
]

amazon_ebay_keywords = [
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
    "can i use eco in morocco",
    "how to start e-commerce business morocco",
    "how to start e commerce business morocco",
    "how to start e commerce in morocco",
    "how to start e-commerce business in morocco",
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
]

amo
...[truncated]