# Site Matthieu Artisan — Jekyll / GitHub Pages

## Ce qui a changé par rapport à tes fichiers d'origine

Les 5 pages qui partagent le même en-tête / menu / pied de page
(`poeles-bois-granules.html`, `a-propos-de-nous.html`, `certifications.html`,
`partenaires.html`, `mentions-legales.html`) utilisent maintenant un
**layout Jekyll commun** :

- `_layouts/default.html` — le squelette HTML partagé
- `_includes/header.html` — en-tête + menu (identique sur les 5 pages)
- `_includes/footer.html` — bouton "retour en haut" + pied de page
- `_includes/scripts.html` — JS du menu hamburger + du bouton "retour en haut"
- `_includes/favicons.html` — liens favicon/apple-touch-icon

Chaque page ne garde plus que ce qui lui est propre : son `<style>`, son
contenu, et son JS spécifique (modale, carrousel d'avis, onglets…).
**Résultat concret** : pour changer un lien du menu, une adresse, ou le pied
de page, tu modifies un seul fichier (`_includes/header.html` ou
`_includes/footer.html`) au lieu des 5 pages une par une.

Les 3 pages "portail" (`index.html`, `expertise.html`, `expertise2.html`)
ont un design entièrement différent et indépendant : elles n'ont pas été
touchées, elles restent telles quelles.

Tout le contenu, tous les textes, tout le CSS et tout le JavaScript ont été
vérifiés automatiquement pour être strictement identiques à tes fichiers
d'origine (mêmes styles, mêmes fonctions JS, mêmes éléments). Deux petites
incohérences pré-existantes ont été corrigées au passage :

- Sur `poeles-bois-granules.html`, l'onglet "À propos de nous" du menu
  était surligné comme actif par erreur (copié depuis une autre page) :
  ce n'est plus le cas, aucun onglet n'est actif sur cette page puisqu'elle
  n'a pas d'entrée dédiée dans le menu.
- Le pied de page de `mentions-legales.html` utilisait un texte de copyright
  légèrement différent des 4 autres pages (et une balise `</p>` en trop) :
  il est maintenant identique aux autres.

### Fichiers non repris
- `index_bk.html` (une ancienne sauvegarde) et
  `poeles-bois-granules_avant boutons V1 V2.zip` (une archive de secours)
  n'ont pas été inclus : ce sont des copies de travail, pas des pages du
  site en ligne. Dis-moi si tu veux que je les remette.

### Images encore manquantes
Comme prévu, il manque toujours :
- les photos de réalisations référencées dans `a-propos-de-nous.html`
  (dossier `Projets/…`)
- `Zone.intervention.matthieu-artisan.plomberie.gif` référencée dans
  `partenaires.html`

Tu pourras les ajouter directement dans le dépôt GitHub une fois celui-ci
en place (même méthode que pour le reste : upload via l'interface web).

## Mettre le site en ligne (upload via GitHub, sans ligne de commande)

1. Dézippe l'archive que je t'ai envoyée : tu obtiens un dossier avec tous
   ces fichiers (y compris les dossiers cachés `_layouts` et `_includes`).
2. Va sur la page de ton dépôt GitHub, onglet **"Add file" → "Upload files"**.
3. **Glisse le contenu du dossier** (pas le zip lui-même, ni le dossier
   parent — sélectionne tous les fichiers/dossiers à l'intérieur) dans la
   zone d'upload. Les navigateurs récents (Chrome, Firefox, Edge) supportent
   le glisser-déposer de dossiers entiers, `_layouts` et `_includes` inclus.
4. Si `.gitignore` n'apparaît pas après le glisser-déposer (certains
   navigateurs ignorent les fichiers commençant par un point), ajoute-le à
   part avec "Add file" → "Create new file", nomme-le `.gitignore` et colle
   son contenu.
5. Valide le commit ("Commit changes").
6. Va dans **Settings → Pages** de ton dépôt :
   - Source : **"Deploy from a branch"**
   - Branch : la branche où tu viens d'uploader (souvent `main`), dossier `/ (root)`
   - Enregistre.
7. GitHub construit le site automatiquement (Jekyll est intégré, aucune
   installation nécessaire de ton côté) — ça prend en général 1 à 2 minutes.
   L'URL du site apparaît en haut de cette même page Settings → Pages une
   fois prêt.

## URL du site

Ton repo s'appelle `MATTHIEUARTISAN/MATTHIEUARTISAN`. Comme il ne s'appelle
pas exactement `MATTHIEUARTISAN.github.io`, GitHub Pages le publie en
"project page", à cette adresse (déjà configurée dans `_config.yml`) :

```
https://matthieuartisan.github.io/MATTHIEUARTISAN/
```

C'est cette URL qui fonctionnera dès que tu auras activé GitHub Pages
(étape 6 ci-dessus) — aucune configuration DNS n'est nécessaire pour ça,
tous les liens et images du site s'adaptent automatiquement au préfixe
`/MATTHIEUARTISAN/`.

## Plus tard : brancher matthieu-artisan.fr

Quand tu seras prêt à faire pointer `matthieu-artisan.fr` sur ce dépôt,
il faudra :

1. Chez ton registrar de domaine, ajouter les enregistrements DNS demandés
   par GitHub Pages (en général un enregistrement `A`/`ALIAS` vers les IP
   de GitHub Pages, ou un `CNAME` vers `matthieuartisan.github.io` si tu
   utilises un sous-domaine comme `www.matthieu-artisan.fr`).
2. Créer un fichier nommé `CNAME` (sans extension) à la racine du repo,
   contenant uniquement `matthieu-artisan.fr`.
3. Renseigner ce même domaine dans **Settings → Pages → Custom domain**
   sur GitHub.
4. Mettre à jour `_config.yml` : `url: "https://matthieu-artisan.fr"` et
   `baseurl: ""` (un domaine personnalisé sert toujours le site à la
   racine, sans préfixe `/MATTHIEUARTISAN/`).

Dis-moi quand tu veux passer à cette étape, je t'accompagne pour les DNS
et je prépare les fichiers.
