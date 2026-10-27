/*
 * Accès à la partie "Expertise" (en construction) par mot de passe.
 *
 * ATTENTION : le site est hébergé par GitHub Pages, sans serveur. Cette protection est donc
 * une barrière "de courtoisie" : elle écarte les visiteurs de passage, mais quelqu'un de
 * technique pourrait la contourner en lisant le code de la page.
 *
 * Utilisation :
 *  - Page d'accueil : <script src="expertise-gate.js"></script>
 *      puis ExpertiseGate.open(fonctionSiSucces) ouvre la fenêtre de saisie.
 *  - Page protégée : <script src="expertise-gate.js" data-protect></script> dans le <head>.
 *      Sans mot de passe valide, la page est masquée et la saisie s'affiche.
 *
 * Changer le mot de passe : calculer l'empreinte SHA-256 de
 *   "matthieu-artisan:expertise:" + nouveauMotDePasse
 * (par exemple avec https://emn178.github.io/online-tools/sha256.html) et la coller dans HASH.
 *
 * Pour supprimer l'accès protégé à la mise en ligne : retirer la balise <script ... data-protect>
 * des pages Expertise (et le bouton "En construction" de index.html).
 */
(function () {
    "use strict";

    var SALT = "matthieu-artisan:expertise:";
    var HASH = "2434a4c0871899935ce3a863e9b4806649659ba2a6979f2f7c039bb754722050";
    var KEY = "ma_expertise_ok";
    var DEMO_URL = "expertise-demo.html";
    var SITE_URL = "expertise.html";

    var script = document.currentScript;
    var protect = !!(script && script.hasAttribute("data-protect"));

    /* ---------- SHA-256 (indépendant du navigateur et du contexte HTTPS) ---------- */
    function sha256(message) {
        var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
        var bytes = unescape(encodeURIComponent(message)).split("").map(function (c) { return c.charCodeAt(0); });
        var bitLen = bytes.length * 8;
        bytes.push(0x80);
        while (bytes.length % 64 !== 56) bytes.push(0);
        for (var i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
        function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
        for (var off = 0; off < bytes.length; off += 64) {
            var w = new Array(64);
            for (var t = 0; t < 16; t++) {
                w[t] = (bytes[off + t * 4] << 24) | (bytes[off + t * 4 + 1] << 16) | (bytes[off + t * 4 + 2] << 8) | bytes[off + t * 4 + 3];
            }
            for (t = 16; t < 64; t++) {
                var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
                var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
                w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
            }
            var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
            for (t = 0; t < 64; t++) {
                var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
                var ch = (e & f) ^ (~e & g);
                var t1 = (h + S1 + ch + K[t] + w[t]) | 0;
                var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
                var maj = (a & b) ^ (a & c) ^ (b & c);
                var t2 = (S0 + maj) | 0;
                h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
            }
            H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
        }
        return H.map(function (x) { return ("00000000" + (x >>> 0).toString(16)).slice(-8); }).join("");
    }

    /* ---------- Mémorisation de l'accès pendant la visite ---------- */
    function isUnlocked() {
        try { if (sessionStorage.getItem(KEY) === "1") return true; } catch (e) { /* ignoré */ }
        return document.cookie.indexOf(KEY + "=1") !== -1;
    }
    function remember() {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* ignoré */ }
        try { document.cookie = KEY + "=1; path=/; SameSite=Lax"; } catch (e) { /* ignoré */ }
    }
    function check(pw) { return sha256(SALT + pw) === HASH; }

    /* ---------- Styles de la fenêtre de saisie et du bandeau ---------- */
    var style = document.createElement("style");
    style.textContent =
        ".gate-locked body > *:not(.gate-overlay){display:none!important}" +
        ".gate-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;" +
        "background:rgba(10,20,40,.72);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}" +
        ".gate-overlay.gate-page{background:linear-gradient(160deg,#0E2A52,#1a3d6e)}" +
        ".gate-box{width:100%;max-width:380px;background:#fff;border-radius:12px;padding:28px 26px 22px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.35);color:#0f172a}" +
        ".gate-box h2{font-size:1.25rem;margin:0 0 8px;color:#0E2A52}" +
        ".gate-box p{font-size:.9rem;line-height:1.45;color:#475569;margin:0 0 16px}" +
        ".gate-box input{width:100%;padding:11px 14px;font:inherit;font-size:1rem;letter-spacing:3px;text-align:center;border:2px solid #cbd5e1;border-radius:8px;outline:none}" +
        ".gate-box input:focus{border-color:#1a67b3}" +
        ".gate-error{min-height:1.2em;margin:8px 0 4px!important;font-size:.82rem!important;font-weight:600;color:#c0392b!important}" +
        ".gate-actions{display:flex;gap:10px;justify-content:center;margin-top:6px}" +
        ".gate-actions button,.gate-actions a{padding:10px 20px;font:inherit;font-size:.88rem;font-weight:700;border-radius:24px;cursor:pointer;text-decoration:none}" +
        ".gate-ok{background:#0E2A52;color:#fff;border:2px solid #0E2A52}" +
        ".gate-ok:hover{background:#1a67b3;border-color:#1a67b3}" +
        ".gate-cancel{background:#fff;color:#475569;border:2px solid #cbd5e1}" +
        ".gate-cancel:hover{border-color:#94a3b8}" +
        ".gate-shake{animation:gateShake .35s}" +
        "@keyframes gateShake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}" +
        ".gate-bar{background:#0E2A52;color:#fff;text-align:center;font:600 .8rem 'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;padding:7px 12px}" +
        ".gate-bar a{color:#bfdbfe;margin-left:10px;white-space:nowrap}" +
        ".gate-bar a:hover{color:#fff}";
    document.head.appendChild(style);

    /* ---------- Fenêtre de saisie du mot de passe ---------- */
    var overlay = null;

    function open(onSuccess, mode) {
        if (isUnlocked()) { if (onSuccess) onSuccess(); return; }
        if (overlay) return;
        var pageMode = mode === "page";
        overlay = document.createElement("div");
        overlay.className = "gate-overlay" + (pageMode ? " gate-page" : "");
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-labelledby", "gate-title");
        overlay.innerHTML =
            '<form class="gate-box" autocomplete="off">' +
            '<h2 id="gate-title">Partie Expertise en construction</h2>' +
            "<p>Cet espace n'est pas encore ouvert au public. Saisissez le mot de passe pour y accéder.</p>" +
            '<input type="password" name="gate-pw" placeholder="Mot de passe" aria-label="Mot de passe" autocomplete="off">' +
            '<p class="gate-error" role="alert"></p>' +
            '<div class="gate-actions">' +
            '<button type="submit" class="gate-ok">Accéder</button>' +
            (pageMode
                ? '<a href="index.html" class="gate-cancel">Retour à l\'accueil</a>'
                : '<button type="button" class="gate-cancel">Annuler</button>') +
            "</div></form>";
        document.body.appendChild(overlay);

        var form = overlay.querySelector("form");
        var input = overlay.querySelector("input");
        var error = overlay.querySelector(".gate-error");
        setTimeout(function () { input.focus(); }, 30);

        function close() {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            overlay = null;
            document.removeEventListener("keydown", onKey);
        }
        function onKey(ev) { if (ev.key === "Escape" && !pageMode) close(); }
        document.addEventListener("keydown", onKey);

        var cancel = overlay.querySelector("button.gate-cancel");
        if (cancel) cancel.addEventListener("click", close);
        if (!pageMode) {
            overlay.addEventListener("click", function (ev) { if (ev.target === overlay) close(); });
        }
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            if (check(input.value.trim())) {
                remember();
                close();
                if (onSuccess) onSuccess();
            } else {
                error.textContent = "Mot de passe incorrect.";
                input.value = "";
                input.focus();
                form.classList.remove("gate-shake");
                void form.offsetWidth;
                form.classList.add("gate-shake");
            }
        });
    }

    /* ---------- Bandeau de navigation Expertise <-> maquette (accès validé) ---------- */
    function addBar() {
        if (document.querySelector(".gate-bar")) return;
        var file = (location.pathname.split("/").pop() || "").toLowerCase();
        if (file.indexOf("expertise-demo") === 0) return; /* la maquette a déjà son propre bandeau */
        var bar = document.createElement("div");
        bar.className = "gate-bar";
        bar.innerHTML = 'Accès privé : partie Expertise en construction <a href="' + DEMO_URL + '">Voir la maquette (démo) &rarr;</a>';
        document.body.insertBefore(bar, document.body.firstChild);
    }

    window.ExpertiseGate = { open: open, isUnlocked: isUnlocked, siteUrl: SITE_URL, demoUrl: DEMO_URL };

    /* ---------- Page protégée ---------- */
    if (protect) {
        var locked = !isUnlocked();
        if (locked) document.documentElement.classList.add("gate-locked");
        var init = function () {
            if (locked) {
                open(function () {
                    document.documentElement.classList.remove("gate-locked");
                    addBar();
                }, "page");
            } else {
                addBar();
            }
        };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
        else init();
    }
})();
