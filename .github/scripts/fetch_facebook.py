#!/usr/bin/env python3
"""Récupère les derniers posts de la page Facebook et les enregistre dans fb-cache/.

Utilisé par le workflow GitHub Actions « Mise à jour du flux Facebook ».
Variables d'environnement :
  FB_PAGE_TOKEN  jeton d'accès de la Page (secret GitHub, obligatoire)
  FB_PAGE_ID     identifiant de la Page (par défaut : Matthieu Artisan)
"""
import json, os, re, sys, urllib.parse, urllib.request, urllib.error
from datetime import datetime, timezone

PAGE_ID = os.environ.get("FB_PAGE_ID", "61594346696834")
TOKEN = os.environ.get("FB_PAGE_TOKEN", "").strip()
API = "https://graph.facebook.com/v21.0"
OUT = "fb-cache"
IMG = os.path.join(OUT, "img")
MAX_POSTS = 10


def get_json(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:
            err = json.loads(body).get("error", {})
        except ValueError:
            err = {}
        msg = err.get("message", body[:300])
        if err.get("code") == 190:
            msg += "  -> Le jeton Facebook est invalide ou expiré : en générer un nouveau (voir le guide)."
        sys.exit("Erreur de l'API Facebook (%s) : %s" % (e.code, msg))


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    if not TOKEN:
        sys.exit("FB_PAGE_TOKEN absent : ajouter le secret dans GitHub (voir le guide).")
    params = urllib.parse.urlencode({
        "fields": "id,message,created_time,permalink_url,full_picture",
        "limit": 25,
        "access_token": TOKEN,
    })
    data = get_json("%s/%s/published_posts?%s" % (API, PAGE_ID, params))
    posts, keep = [], set()
    os.makedirs(IMG, exist_ok=True)
    for p in data.get("data", []):
        msg = (p.get("message") or "").strip()
        pic = p.get("full_picture")
        if not msg and not pic:
            continue
        image = None
        if pic:
            name = re.sub(r"[^0-9A-Za-z_-]", "_", p["id"]) + ".jpg"
            dest = os.path.join(IMG, name)
            if not os.path.exists(dest):
                try:
                    download(pic, dest)
                except Exception as e:  # image indisponible : le post s'affiche sans
                    print("Image ignorée pour %s : %s" % (p["id"], e))
                    dest = None
            if dest and os.path.exists(dest):
                image = "fb-cache/img/" + name
                keep.add(name)
        posts.append({
            "id": p["id"],
            "date": p.get("created_time"),
            "message": msg,
            "url": p.get("permalink_url") or "https://www.facebook.com/profile.php?id=" + PAGE_ID,
            "image": image,
        })
        if len(posts) >= MAX_POSTS:
            break
    if not posts:
        sys.exit("Aucun post récupéré : le cache existant est conservé.")
    for f in os.listdir(IMG):  # supprime les images devenues inutiles
        if f not in keep:
            os.remove(os.path.join(IMG, f))
    feed = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "page_url": "https://www.facebook.com/profile.php?id=" + PAGE_ID,
        "posts": posts,
    }
    tmp = os.path.join(OUT, "feed.json.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(feed, f, ensure_ascii=False, indent=1)
    os.replace(tmp, os.path.join(OUT, "feed.json"))
    print("%d posts enregistrés." % len(posts))


if __name__ == "__main__":
    main()
