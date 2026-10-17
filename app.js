/* Nau Raatein — app shell. State-based chapter navigation (no anchor scrolling).
   Chapters: welcome → rangoli → nights → day/N → suggestion → portrait → final (+ extra/ID). */
(function () {
  var D = window.NR_CONTENT, C = D.config;
  var stage = document.getElementById("stage");
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = null;          // { key, el, cleanup }
  var busy = false;
  var NAMES = ["Shailputri", "Brahmacharini", "Chandraghanta", "Kushmanda", "Skandamata", "Katyayani", "Kalaratri", "Mahagauri", "Siddhidatri"];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); return true; } catch (e) { return v === undefined ? null : false; } }
  function reveal(root) { $$("[data-r]", root).forEach(function (el, i) { el.style.setProperty("--i", i); }); }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 3600);
  }

  var DIYA = '<svg class="diya-svg" viewBox="0 0 64 56" aria-hidden="true"><path class="flame" d="M32 4c5 7 8 11 8 16a8 8 0 1 1-16 0c0-5 3-9 8-16z"/><path class="bowl" d="M6 30h52c0 12-10 22-26 22S6 42 6 30z"/><path class="rim" d="M6 30h52" /></svg>';
  var ORN = '<div class="orn" aria-hidden="true"><i></i><svg viewBox="0 0 40 20"><path d="M20 2c3 4 3 8 0 12-3-4-3-8 0-12zM8 8c4-1 7 1 9 5-4 1-7-1-9-5zM32 8c-4-1-7 1-9 5 4 1 7-1 9-5z"/></svg><i></i></div>';

  var MOTIFS = [
    '<path d="M4 60 36 18l16 22 12-14 28 34z"/><circle cx="82" cy="18" r="7"/>',                                   // 1 mountain
    '<g>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<circle cx="' + (12 + i * 14) + '" cy="' + (36 + Math.sin(i) * 10) + '" r="5"/>'; }).join("") + '</g>', // 2 mala beads
    '<path d="M60 10a28 28 0 1 0 0 52 22 22 0 1 1 0-52z"/><path d="M78 18c8 4 12 12 12 22"/>',                    // 3 crescent
    '<circle cx="48" cy="36" r="14"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { var a = i * 36 * Math.PI / 180; return '<path d="M' + (48 + Math.cos(a) * 20).toFixed(1) + ' ' + (36 + Math.sin(a) * 20).toFixed(1) + 'L' + (48 + Math.cos(a) * 30).toFixed(1) + ' ' + (36 + Math.sin(a) * 30).toFixed(1) + '"/>'; }).join(""), // 4 sun
    [0, 1, 2, 3, 4].map(function (i) { return '<path d="M48 58C' + (24 + i * 12) + ' 40 ' + (30 + i * 9) + ' 20 48 10c' + (18 - i * 9) + ' 10 ' + (18 - i * 9) + ' 30 0 48z"/>'; }).join(""), // 5 lotus
    '<path d="M14 58 70 14M62 10l14 4-4 14M20 50l-6 8 8-6"/><path d="M30 14c16 6 30 20 36 38"/>',                // 6 sword & arc
    '<path d="M48 8l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z"/><circle cx="20" cy="18" r="3"/><circle cx="76" cy="46" r="4"/><circle cx="14" cy="50" r="2.5"/>', // 7 stars
    '<path d="M48 54c-18 0-30-10-30-22 0-10 10-18 30-18 20 0 30 8 30 18 0 12-12 22-30 22z"/><path d="M48 16v36M30 20c0 12 4 24 18 32M66 20c0 12-4 24-18 32"/>', // 8 shell
    '<path d="M48 6l6 20 20 6-20 6-6 20-6-20-20-6 20-6z"/><path d="M80 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M14 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>' // 9 sparkle
  ];
  function motif(n) { return '<svg class="motif" viewBox="0 0 96 64" aria-hidden="true">' + MOTIFS[n - 1] + '</svg>'; }

  /* ---------- progress UI ---------- */
  function renderProgress() {
    var c = NRUnlock.count(), box = $("#progress");
    var dots = "";
    for (var n = 1; n <= 9; n++) dots += '<i class="' + (n <= c ? "on" : "") + (current && current.key === "day/" + n ? " here" : "") + '"></i>';
    box.innerHTML = dots;
    var lbl = c >= 9 ? "Saare 9 din khul chuke hain" : "Din " + c + " / 9 khul chuke hain";
    box.setAttribute("aria-label", lbl); box.title = lbl;
    $("#progressText").textContent = c + "/9";
  }

  /* ---------- gating ---------- */
  function gateOpen(name) { return NRUnlock.count() >= (C.gates[name] || 0); }

  /* ---------- screens ---------- */
  var screens = {};

  screens.welcome = function () {
    var w = D.welcome;
    return {
      cls: "ch-welcome",
      html:
        '<div class="center-col">' +
        '<p class="eyebrow" data-r>' + esc(w.eyebrow) + '</p>' +
        '<div class="welcome-art" data-r aria-hidden="true">' + mandala("welcome", true) + '<div class="welcome-diya">' + DIYA + '</div></div>' +
        '<h1 class="display" data-r>' + esc(C.title) + '</h1>' +
        '<p class="kicker script" data-r>' + esc(w.kicker) + '</p>' + ORN +
        '<p class="lead" data-r>' + esc(w.greeting) + '</p>' +
        '<button class="btn btn-primary btn-lg" data-go="rangoli" data-r>' + esc(w.button) + '</button>' +
        '<p class="hint" data-r>' + esc(w.hint) + '</p>' +
        '</div>'
    };
  };

  /* mandala: layered rings of petals + dots, generated as SVG */
  function mandala(id, simple) {
    var s = '<svg class="mandala" viewBox="-200 -200 400 400" aria-hidden="true">';
    function petalRing(count, r0, len, wid, cls) {
      var out = '<g class="ring ' + cls + '">';
      for (var i = 0; i < count; i++) {
        var a = 360 / count * i;
        out += '<path transform="rotate(' + a + ')" d="M0 ' + (-r0) + ' C ' + wid + ' ' + (-r0 - len * 0.35) + ' ' + wid + ' ' + (-r0 - len * 0.8) + ' 0 ' + (-r0 - len) + ' C ' + (-wid) + ' ' + (-r0 - len * 0.8) + ' ' + (-wid) + ' ' + (-r0 - len * 0.35) + ' 0 ' + (-r0) + 'z"/>';
      }
      return out + '</g>';
    }
    function dotRing(count, r, size, cls) {
      var out = '<g class="ring dots ' + cls + '">';
      for (var i = 0; i < count; i++) { var a = (360 / count * i) * Math.PI / 180; out += '<circle cx="' + (Math.cos(a) * r).toFixed(1) + '" cy="' + (Math.sin(a) * r).toFixed(1) + '" r="' + size + '"/>'; }
      return out + '</g>';
    }
    s += '<circle class="m-outline" r="190" pathLength="1"/>' + '<circle class="m-outline" r="172" pathLength="1"/>';
    s += dotRing(48, 181, 2.4, "r-a");
    s += petalRing(24, 128, 44, 13, "r-b p-rose");
    s += petalRing(16, 96, 52, 17, "r-c p-gold");
    s += dotRing(32, 142, 2, "r-b");
    s += petalRing(12, 58, 48, 19, "r-a p-wine");
    s += petalRing(8, 30, 34, 15, "r-c p-marigold");
    s += '<circle class="m-core" r="20"/><circle class="m-core2" r="9"/>';
    return s + '</svg>';
  }

  screens.rangoli = function () {
    var r = D.rangoli, diyas = "";
    for (var i = 0; i < 5; i++) diyas += '<button class="diya" aria-pressed="false" aria-label="Diya ' + (i + 1) + ' jalayein">' + DIYA + '</button>';
    return {
      cls: "ch-rangoli",
      html:
        '<div class="two-col">' +
        '<div class="col-art" data-r><div class="rangoli-wrap" id="rangoliWrap">' + mandala("rangoli") + '</div></div>' +
        '<div class="col-text">' +
        '<p class="eyebrow" data-r>Chapter 2</p><h2 class="h2" data-r>' + esc(r.title) + '</h2>' + ORN +
        r.paragraphs.map(function (p) { return '<p class="body" data-r>' + esc(p) + '</p>'; }).join("") +
        '<figure class="mantra paper tape" data-r><blockquote lang="sa-Latn">' + esc(r.mantra.text).replace(/\n/g, "<br>") + '</blockquote><figcaption>' + esc(r.mantra.meaning) + '</figcaption></figure>' +
        '<div class="diya-row" data-r role="group" aria-label="' + esc(r.diyaPrompt) + '">' + diyas + '</div>' +
        '<div class="row-actions" data-r><button class="btn btn-ghost" id="lightAll">' + esc(r.diyaPrompt) + '</button></div>' +
        '<p class="diya-msg" id="diyaMsg" aria-live="polite" data-r></p>' +
        '<div class="row-actions" data-r><button class="btn btn-primary" data-go="nights">' + esc(r.next) + '</button></div>' +
        '</div></div>',
      after: function (el) {
        var all = $$(".diya", el), msg = $("#diyaMsg", el), wrap = $("#rangoliWrap", el);
        function update() {
          var lit = all.filter(function (d) { return d.classList.contains("lit"); }).length;
          wrap.style.setProperty("--glow", (lit / all.length).toFixed(2));
          wrap.classList.toggle("glow", lit > 0);
          msg.textContent = lit === all.length ? r.diyaDone : "";
          if (lit === all.length && !update.done) { update.done = true; var b = wrap.getBoundingClientRect(); NRPetals.burst(b.left + b.width / 2, b.top + b.height / 2); }
        }
        all.forEach(function (d) {
          d.addEventListener("click", function () { var on = !d.classList.contains("lit"); d.classList.toggle("lit", on); d.setAttribute("aria-pressed", on); update(); });
        });
        $("#lightAll", el).addEventListener("click", function () {
          all.forEach(function (d, i) { setTimeout(function () { d.classList.add("lit"); d.setAttribute("aria-pressed", "true"); update(); }, reduceMQ.matches ? 0 : i * 220); });
        });
      }
    };
  };

  screens.nights = function () {
    var N = D.nights, c = NRUnlock.count();
    var cards = D.days.map(function (d) {
      var open = NRUnlock.isDayUnlocked(d.n), today = d.n === c && c < 10;
      return '<button class="night-card' + (open ? " open" : " locked") + '" style="--accent:' + d.accent.main + ';--soft:' + d.accent.soft + ';--deep:' + d.accent.deep + '"' +
        (open ? ' data-go="day/' + d.n + '"' : ' aria-disabled="true" data-locked="' + d.n + '"') + ' data-r>' +
        '<span class="nc-num">' + d.n + '</span>' +
        '<span class="nc-icon" aria-hidden="true">' + (open ? d.icon : "🔒") + '</span>' +
        '<span class="nc-name">' + esc(d.goddess.replace("Maa ", "")) + '</span>' +
        '<span class="nc-theme">' + esc(d.theme) + '</span>' +
        '<span class="nc-colour"><i style="background:' + d.colour.hex + '"></i>' + esc(d.colour.name) + '</span>' +
        '<span class="nc-state">' + (open ? (today ? "Aaj ka din · Khula" : "Khula hai") : "Locked · " + esc(NRUnlock.dayLabel(d.n))) + '</span>' +
        '</button>';
    }).join("");

    function beyond(name, title, icon, need, label) {
      var open = gateOpen(name);
      return '<button class="beyond-card' + (open ? " open" : " locked") + '"' + (open ? ' data-go="' + name + '"' : ' aria-disabled="true" data-locked-chapter="' + name + '"') + ' data-r>' +
        '<span class="bc-icon" aria-hidden="true">' + (open ? icon : "🔒") + '</span><span class="bc-title">' + esc(title) + '</span>' +
        '<span class="bc-state">' + (open ? "Khula hai" : "Din " + need + " ke baad khulega (" + esc(NRUnlock.dayLabel(need)) + ")") + '</span></button>';
    }
    var extras = D.extras.map(function (e) {
      var open = NRUnlock.isExtraUnlocked(e);
      return '<button class="beyond-card' + (open ? " open" : " locked") + '"' + (open ? ' data-go="extra/' + esc(e.id) + '"' : ' aria-disabled="true" data-locked-extra="' + esc(e.id) + '"') + ' data-r>' +
        '<span class="bc-icon" aria-hidden="true">' + (open ? e.icon : "🔒") + '</span><span class="bc-title">' + esc(e.title) + '</span>' +
        '<span class="bc-state">' + (open ? "Khula hai" : "Khulega " + esc(NRUnlock.extraLabel(e))) + '</span></button>';
    }).join("");

    return {
      cls: "ch-nights",
      html:
        '<div class="wide-col">' +
        '<p class="eyebrow" data-r>Chapter 3</p><h2 class="h2" data-r>' + esc(N.title) + '</h2>' +
        '<p class="body center" data-r>' + esc(N.intro) + '</p>' +
        '<div class="meter" data-r role="img" aria-label="' + (c >= 9 ? "Saare 9 din khul chuke hain" : "Din " + c + " / 9 khul chuke hain") + '"><span style="width:' + (c / 9 * 100) + '%"></span><b>' + c + ' / 9</b></div>' +
        '<div class="petal-progress" aria-label="Nav raaton ka mandala progress"><div class="petal-mandala" aria-hidden="true">' + D.days.map(function (d, i) { return '<span class="petal ' + (i < c ? 'lit' : '') + '" style="--petal:' + i + '">' + (i < c ? '✦' : '·') + '</span>'; }).join('') + '<b>' + c + '<small>/9</small></b></div><p class="petal-caption script">' + (c >= 9 ? 'Nau pankhudiyan, ek poori dua ✨' : 'Har din ek pankhudi roshan hogi') + '</p></div>' + '<div class="night-grid">' + cards + '</div>'+
        '<h3 class="h3" data-r>' + esc(N.beyondTitle) + '</h3>' +
        '<div class="beyond-grid">' + beyond("suggestion", "Aapki Pasand, Aapki Baat", "💌", C.gates.suggestion) + beyond("portrait", "Ek Chhoti Si Tasveer", "🖼️", C.gates.portrait) + beyond("final", "Ek Khat, Aapke Naam", "💝", C.gates.final) + extras + '</div>' +
        '</div>',
      after: function (el) {
        $$("[data-locked]", el).forEach(function (b) { b.addEventListener("click", function () { toast("Din " + b.getAttribute("data-locked") + " " + NRUnlock.dayLabel(+b.getAttribute("data-locked")) + " ko khulega."); }); });
        $$("[data-locked-chapter]", el).forEach(function (b) { b.addEventListener("click", function () { var g = C.gates[b.getAttribute("data-locked-chapter")]; toast("Yeh Din " + g + " ke baad, " + NRUnlock.dayLabel(g) + " ko khulega."); }); });
        $$("[data-locked-extra]", el).forEach(function (b) { b.addEventListener("click", function () { var e = D.extras.filter(function (x) { return x.id === b.getAttribute("data-locked-extra"); })[0]; toast("Yeh " + NRUnlock.extraLabel(e) + " ko khulega."); }); });
      }
    };
  };

  screens.day = function (n) {
    var d = D.days[n - 1]; if (!d) return screens.nights();
    var prev = n > 1, nextOpen = n < 9 && NRUnlock.isDayUnlocked(n + 1);
    var nextTxt = n < 9 ? ("Din " + (n + 1) + " →") : "Aapki Pasand →";
    var nextGo = n < 9 ? (nextOpen ? "day/" + (n + 1) : null) : "suggestion";
    var nextState = n < 9 && !nextOpen ? "Din " + (n + 1) + " khulega " + NRUnlock.dayLabel(n + 1) : "";
    return {
      cls: "ch-day", day: n, tint: d.accent.soft,
      style: "--accent:" + d.accent.main + ";--soft:" + d.accent.soft + ";--deep:" + d.accent.deep,
      html:
        '<div class="day-grid day-slide-layout">' +
        '<header class="day-head" data-r>' +
        '<div class="day-badge"><span class="db-day">Din</span><span class="db-num">' + n + '</span>' + motif(n) + '</div>' +
        '<p class="eyebrow">' + NAMES[n - 1] + ' · ' + esc(d.theme) + '</p>' +
        '<h2 class="h2 day-title">' + d.icon + ' ' + esc(d.goddess) + '</h2>' +
        '<p class="colour-chip"><i style="background:' + d.colour.hex + '"></i>Aaj ka rang: <b>' + esc(d.colour.name) + '</b></p>' +
        '<ul class="facts">' + d.facts.map(function (f) { return '<li><span>' + esc(f[0]) + '</span>' + esc(f[1]) + '</li>'; }).join("") + '</ul>' +
        '</header>' +
        '<div class="day-body day-slide-body">' +
        '<section class="day-slide active" data-slide="0"><p class="slide-kicker script">Pehla panna · Maa ka Mahatva</p><article class="card paper tape"><p class="card-label">Navratri ka Mahatva</p><p class="body">' + esc(d.devotional) + '</p></article><p class="slide-note">Is raat ki roshni ko thoda thehar kar mehsoos kijiye. ✨</p></section>' +
        '<section class="day-slide" data-slide="1" hidden><p class="slide-kicker script">Doosra panna · Dil se</p><article class="card letter"><p class="card-label script">Laxmi Jii ke liye, dil se</p><p class="body">' + esc(d.personal) + '</p></article><p class="slide-note">Yeh panna sirf aapke liye likha gaya hai. 🌷</p></section>' +
        '<section class="day-slide" data-slide="2" hidden><p class="slide-kicker script">Teesra panna · Ek pyaari si dua</p><aside class="reflect"><p class="card-label">Ek Chhota Sa Vichaar</p><p class="body">' + esc(d.reflection) + '</p><p class="dua script">' + esc(d.dua) + '</p></aside><div class="slide-finish">🌼 <span>Is din ki yaad apne saath rakhiyega.</span></div></section>' +
        '<section class="day-slide secret-slide" data-slide="3" hidden><p class="slide-kicker script">Chhupa hua panna · Sirf aapke liye</p><div class="secret-envelope-wrap"><button class="secret-envelope" id="secretEnvelope" aria-expanded="false"><span class="secret-seal">✿</span><span class="script">Ek chhoti si baat…</span><small>Kholein ♡</small></button></div><article class="card secret-note" id="secretNote" hidden><p class="card-label script">Aaj ka chhota sa raaz</p><p class="body">' + esc(d.personal) + '</p><p class="dua script">' + esc(d.dua) + '</p></article><p class="slide-note">Kabhi-kabhi sabse pyaari baat dheere se kahi jaati hai. 💌</p></section>' +
        '<div class="slide-controls" data-r><div class="slide-count"><span id="slideCount">01</span><i>/ 04</i></div><div class="slide-progress" aria-label="Panne ki progress"><i class="current"></i><i></i><i></i><i></i></div><div class="slide-buttons"><button class="btn btn-ghost" id="slidePrev" disabled>← Pichhla panna</button><button class="btn btn-primary" id="slideNext">Agla panna →</button></div></div>' +
        '<nav class="day-nav" data-r aria-label="Din navigation">' +
        (prev ? '<button class="btn btn-ghost" data-go="day/' + (n - 1) + '" data-dir="back">← Din ' + (n - 1) + '</button>' : '<button class="btn btn-ghost" data-go="nights" data-dir="back">← Nau Raatein</button>') +
        '<button class="btn btn-ghost" data-go="nights">Sab Din</button>' +
        (nextGo ? '<button class="btn btn-primary" id="finishDay">' + nextTxt + '</button>' : '<button class="btn btn-primary is-wait" aria-disabled="true" id="waitNext">' + nextTxt + '</button>') +
        '</nav>' + (nextState ? '<p class="hint" data-r>' + esc(nextState) + '</p>' : '') +
        '</div></div>',
      after: function (el) {
        var slides = $$(".day-slide", el), idx = 0;
        var prevBtn = $("#slidePrev", el), nextBtn = $("#slideNext", el), count = $("#slideCount", el);
        var dots = $$(".slide-progress i", el), finish = $("#finishDay", el), wait = $("#waitNext", el);
        var secretBtn = $("#secretEnvelope", el), secretNote = $("#secretNote", el);
        if (secretBtn && secretNote) secretBtn.addEventListener("click", function () { secretNote.hidden = false; secretNote.classList.add("secret-note-open"); secretBtn.setAttribute("aria-expanded", "true"); secretBtn.classList.add("opened"); });
        function showSlide(next) {
          if (next < 0 || next >= slides.length) return;
          idx = next;
          slides.forEach(function (slide, i) { slide.hidden = i !== idx; slide.classList.toggle("active", i === idx); });
          slides[idx].classList.remove("slide-enter"); void slides[idx].offsetWidth; slides[idx].classList.add("slide-enter");
          count.textContent = "0" + (idx + 1);
          dots.forEach(function (dot, i) { dot.classList.toggle("current", i === idx); dot.classList.toggle("done", i < idx); });
          prevBtn.disabled = idx === 0;
          nextBtn.textContent = idx === slides.length - 1 ? "Din mukammal karein ✓" : "Agla panna →";
          var sc = $(".chapter__scroll", el); if (sc) sc.scrollTo({ top: 0, behavior: reduceMQ.matches ? "auto" : "smooth" });
        }
        prevBtn.addEventListener("click", function () { showSlide(idx - 1); });
        nextBtn.addEventListener("click", function () { if (idx < slides.length - 1) showSlide(idx + 1); else if (finish) finish.click(); else if (wait) toast(nextState + "."); });
        if (finish) finish.addEventListener("click", function () { if (nextGo) go(nextGo); });
        if (wait) wait.addEventListener("click", function () { toast(nextState + "."); });
      }
    };
  };

  screens.suggestion = function () {
    var S = D.suggestion, saved = {}; try { saved = JSON.parse(store("nr_suggestion_v1") || "{}"); } catch (e) {}
    var prefs = S.preferences.map(function (p, i) {
      return '<label class="chip"><input type="radio" name="pref" value="' + esc(p) + '"' + (saved.pref === p ? " checked" : "") + '><span>' + esc(p) + '</span></label>';
    }).join("");
    return {
      cls: "ch-suggest",
      html:
        '<div class="narrow-col">' +
        '<p class="eyebrow" data-r>Chapter 5</p><h2 class="h2" data-r>' + esc(S.title) + '</h2>' + ORN +
        '<p class="body center" data-r>' + esc(S.intro) + '</p>' +
        '<fieldset class="paper tape pad" data-r><legend class="card-label">' + esc(S.preferenceLabel) + '</legend><div class="chips">' + prefs + '</div>' +
        '<label class="card-label" for="sugText">' + esc(S.textLabel) + '</label>' +
        '<textarea id="sugText" rows="5" maxlength="600" placeholder="' + esc(S.textPlaceholder) + '">' + esc(saved.text || "") + '</textarea>' +
        '<div class="row-actions wrap"><button class="btn btn-primary" id="sugSave">' + esc(S.save) + '</button><button class="btn btn-ghost" id="sugShare">' + esc(S.share) + '</button>' +
        (C.whatsappNumber ? '<a class="btn btn-ghost" id="sugWa" target="_blank" rel="noopener">' + esc(S.whatsapp) + '</a>' : '') +
        '<button class="btn btn-ghost" id="sugCopy">' + esc(S.copy) + '</button><button class="btn btn-quiet" id="sugClear">' + esc(S.clear) + '</button></div>' +
        '<p class="status" id="sugStatus" role="status" aria-live="polite"></p></fieldset>' +
        '<aside class="notice" data-r><p class="card-label">' + esc(S.privacyTitle) + '</p><p class="body small">' + esc(S.privacyBody) + '</p></aside>' +
        '<div class="row-actions" data-r><button class="btn btn-ghost" data-go="nights" data-dir="back">← Nau Raatein</button><button class="btn btn-primary" data-go="portrait">' + esc(S.next) + '</button></div>' +
        '</div>',
      after: function (el) {
        var ta = $("#sugText", el), st = $("#sugStatus", el);
        function note() {
          var p = ($("input[name=pref]:checked", el) || {}).value || "", t = ta.value.trim();
          return (p ? "Meri pasand: " + p + ". " : "") + (t ? t : "");
        }
        function say(m) { st.textContent = m; }
        $("#sugSave", el).addEventListener("click", function () {
          var ok = store("nr_suggestion_v1", JSON.stringify({ pref: ($("input[name=pref]:checked", el) || {}).value || "", text: ta.value }));
          say(ok ? S.saved : S.noStorage);
        });
        $("#sugClear", el).addEventListener("click", function () {
          try { localStorage.removeItem("nr_suggestion_v1"); } catch (e) {}
          ta.value = ""; $$("input[name=pref]", el).forEach(function (i) { i.checked = false; }); say(S.cleared);
        });
        function copy() {
          var t = note(); if (!t) { say("Pehle kuch chuniye ya likhiye."); return Promise.resolve(false); }
          if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { say(S.copied); return true; }, function () { say(S.noStorage); return false; });
          ta.select(); try { document.execCommand("copy"); say(S.copied); } catch (e) { say(S.noStorage); } return Promise.resolve(true);
        }
        $("#sugCopy", el).addEventListener("click", copy);
        $("#sugShare", el).addEventListener("click", function () {
          var t = note(); if (!t) { say("Pehle kuch chuniye ya likhiye."); return; }
          if (navigator.share) navigator.share({ text: t }).catch(function () {}); else copy();
        });
        var wa = $("#sugWa", el);
        if (wa) wa.addEventListener("click", function () {
          var t = note(); if (!t) { say("Pehle kuch chuniye ya likhiye."); return false; }
          wa.href = "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(t);
        });
      }
    };
  };

  screens.portrait = function () {
    var P = D.portrait;
    return {
      cls: "ch-portrait",
      html:
        '<div class="two-col portrait-cols">' +
        '<div class="col-art" data-r><div class="portrait-polaroid tape"><div class="portrait-frame" id="pFrame"><canvas class="p-sketch" aria-label="Graphite portrait"></canvas><canvas class="p-colour" aria-hidden="true"></canvas><span class="p-pencil" aria-hidden="true">✏️</span><div class="p-loading" id="pLoad">…</div></div><p class="polaroid-cap script" id="pCap">' + esc(P.caption) + '</p></div></div>' +
        '<div class="col-text"><p class="eyebrow" data-r>Chapter 6</p><h2 class="h2" data-r>' + esc(P.title) + '</h2>' + ORN +
        '<p class="body" data-r>' + esc(P.intro) + '</p>' +
        '<p class="stage-label" id="pStage" role="status" aria-live="polite" data-r></p>' +
        '<p class="hint left" id="pNote" data-r hidden></p>' +
        '<div class="row-actions wrap" data-r><button class="btn btn-ghost" id="pAgain">' + esc(P.again) + '</button><button class="btn btn-ghost" id="pFinal">' + esc(P.final) + '</button></div>' +
        '<div class="row-actions wrap" data-r><button class="btn btn-ghost" data-go="suggestion" data-dir="back">← Back</button><button class="btn btn-primary" data-go="final">' + esc(P.next) + '</button></div>' +
        '</div></div>',
      after: function (el, cur) {
        var frame = $("#pFrame", el), lab = $("#pStage", el), note = $("#pNote", el);
        var ctl = NRPortrait.mount(frame, C.portrait, {
          onReady: function (info) { $("#pLoad", el).remove(); if (info.fallback) { note.hidden = false; note.textContent = P.fallbackNote; } },
          onStage: function (s) { lab.textContent = P.stages[s]; frame.setAttribute("data-stage", s); },
          onError: function () { $("#pLoad", el).textContent = "Tasveer load nahi ho paayi (assets/img/portrait-sketch.jpg)."; }
        });
        $("#pAgain", el).addEventListener("click", function () { ctl.play(); });
        $("#pFinal", el).addEventListener("click", function () { ctl.showFinal(); });
        cur.cleanup = function () { ctl.destroy(); };
      }
    };
  };

  screens.final = function () {
    var F = D.final;
    return {
      cls: "ch-final",
      html:
        '<div class="narrow-col final-col">' +
        '<p class="eyebrow" data-r>Chapter 7</p><h2 class="h2" data-r>' + esc(F.title) + '</h2>' +
        '<div class="envelope-stage" id="envStage" data-r>' +
        '<button class="envelope" id="envelope" aria-expanded="false" aria-label="' + esc(F.sealLabel) + '">' +
        '<span class="env-back"></span><span class="env-letter"><i></i><i></i><i></i></span><span class="env-front"></span><span class="env-flap"></span>' +
        '<span class="env-seal" aria-hidden="true">❀</span><span class="env-to script">' + esc(F.to) + '</span></button>' +
        '<p class="hint" id="envHint">' + esc(F.sealLabel) + '</p></div>' +
        '<article class="final-letter paper tape" id="finalLetter" hidden tabindex="-1"><p class="script f-to">' + esc(F.to) + '</p>' +
        F.paragraphs.map(function (p) { return '<p class="body f-r">' + esc(p) + '</p>'; }).join("") +
        '<p class="f-bless f-r">' + esc(F.blessing) + '</p><p class="script f-sign f-r">' + esc(F.close) + ',<br>' + esc(C.from) + '</p><div class="final-secret-wrap f-r"><button class="btn btn-ghost" id="finalSecretBtn" aria-expanded="false">Ek aakhri raaz kholein ✉️</button><div class="final-secret" id="finalSecret" hidden><p class="script">Eluné ♡</p><p class="body">Agar kabhi in nau raaton ki koi ek baat yaad aaye, toh bas itna yaad rakhiyega: aapke liye maangi gayi dua kisi ek din tak mehdood nahi. Yeh chhoti si roshni aage bhi aapke saath rahe.</p><p class="dua script">Har naye savere mein sukoon, himmat aur muskurahat mile. 🌷</p></div></div></article>' +
        '<div class="row-actions wrap final-actions" id="finalActions" hidden><button class="btn btn-ghost" data-go="nights" data-dir="back">Nau Raatein par wapas</button><button class="btn btn-ghost" data-go="welcome" data-dir="back">Shuruaat se dekhein</button></div>' +
        '</div>',
      after: function (el) {
        var env = $("#envelope", el), letter = $("#finalLetter", el), acts = $("#finalActions", el), stg = $("#envStage", el);
        function open() {
          if (env.classList.contains("open")) return;
          env.classList.add("open"); env.setAttribute("aria-expanded", "true"); $("#envHint", el).style.opacity = 0;
          var b = env.getBoundingClientRect(); NRPetals.burst(b.left + b.width / 2, b.top + b.height * 0.4);
          var wait = reduceMQ.matches ? 0 : 1900;
          setTimeout(function () {
            stg.classList.add("done"); letter.hidden = false; acts.hidden = false; letter.classList.add("show");
            $$(".f-r", letter).forEach(function (p, i) { p.style.setProperty("--i", i); });
            letter.focus({ preventScroll: true });
            var sc = $(".chapter__scroll", el); if (sc) sc.scrollTo({ top: letter.offsetTop - 70, behavior: reduceMQ.matches ? "auto" : "smooth" });
          }, wait);
        }
        env.addEventListener("click", open);
      }
    };
  };

  screens.extra = function (id) {
    var e = D.extras.filter(function (x) { return x.id === id; })[0];
    if (!e || !NRUnlock.isExtraUnlocked(e)) return screens.nights();
    return {
      cls: "ch-extra",
      html: '<div class="narrow-col"><p class="eyebrow" data-r>Ek Aur Surprise</p><h2 class="h2" data-r>' + esc(e.icon + " " + e.title) + '</h2>' + ORN +
        '<article class="card letter" data-r>' + e.paragraphs.map(function (p) { return '<p class="body">' + esc(p) + '</p>'; }).join("") + '</article>' +
        '<div class="row-actions" data-r><button class="btn btn-ghost" data-go="nights" data-dir="back">← Nau Raatein</button></div></div>'
    };
  };

  /* ---------- router ---------- */
  function build(key) {
    var parts = key.split("/"), name = parts[0], arg = parts[1];
    if (name === "day") { if (!NRUnlock.isDayUnlocked(+arg)) return build("nights"); return screens.day(+arg); }
    if (name === "suggestion" || name === "portrait" || name === "final") { if (!gateOpen(name)) return build("nights"); }
    if (!screens[name]) return screens.welcome();
    return screens[name](arg);
  }
  function canonical(key) {
    var parts = key.split("/"), name = parts[0];
    if (name === "day" && !NRUnlock.isDayUnlocked(+parts[1])) return "nights";
    if ((name === "suggestion" || name === "portrait" || name === "final") && !gateOpen(name)) return "nights";
    return key;
  }

  function go(key, opts) {
    opts = opts || {};
    key = canonical(key);
    if (busy || (current && current.key === key)) return;
    busy = true;
    var s = build(key);
    var el = document.createElement("section");
    el.className = "chapter " + s.cls; el.setAttribute("data-chapter", key);
    if (s.style) el.setAttribute("style", s.style);
    el.innerHTML = '<div class="chapter__scroll" tabindex="-1"><div class="chapter__inner">' + s.html + '</div></div>';
    reveal(el);
    var dir = opts.dir || "fwd", old = current;
    var cur = { key: key, el: el, cleanup: null };

    document.body.setAttribute("data-chapter", s.cls.replace("ch-", ""));
    document.documentElement.style.setProperty("--tint", s.tint || "#F8E1E4");
    el.classList.add("enter-" + dir);
    stage.appendChild(el);
    current = cur;
    if (s.after) s.after(el, cur);
    renderProgress();
    document.title = (key === "welcome" ? C.title : C.title + " · " + key.replace("/", " ")) ;

    if (old) {
      old.el.classList.add("leave-" + dir);
      if (old.cleanup) old.cleanup();
      var dur = reduceMQ.matches ? 0 : 520;
      setTimeout(function () { old.el.remove(); busy = false; }, dur);
    } else busy = false;
    if (reduceMQ.matches) busy = false;

    var focusEl = $(".chapter__scroll", el);
    setTimeout(function () { try { focusEl.focus({ preventScroll: true }); } catch (e) {} }, 60);

    if (!opts.fromPop) { try { history.pushState({ key: key }, "", location.href); } catch (e) {} }
  }

  /* ---------- global events ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]"); if (!b || b.getAttribute("aria-disabled") === "true") return;
    var key = b.getAttribute("data-go"), dir = b.getAttribute("data-dir") || "fwd";
    ripple(b, e); go(key, { dir: dir });
  });
  function ripple(b, e) {
    if (reduceMQ.matches) return;
    var r = b.getBoundingClientRect(), s = document.createElement("span");
    s.className = "ripple"; s.style.left = (e.clientX - r.left || r.width / 2) + "px"; s.style.top = (e.clientY - r.top || r.height / 2) + "px";
    b.appendChild(s); setTimeout(function () { s.remove(); }, 600);
  }
  window.addEventListener("popstate", function (e) {
    var k = (e.state && e.state.key) || "welcome";
    busy = false; go(k, { dir: "back", fromPop: true });
  });
  $("#btnHome").addEventListener("click", function () { go(NRUnlock.count() >= 1 && current && current.key !== "welcome" ? "nights" : "welcome", { dir: "back" }); });
  document.addEventListener("keydown", function (e) {
    if (/INPUT|TEXTAREA/.test((e.target.tagName || ""))) return;
    var m = /^day\/(\d)$/.exec(current ? current.key : "");
    if (m) {
      var n = +m[1];
      if (e.key === "ArrowRight" && n < 9 && NRUnlock.isDayUnlocked(n + 1)) go("day/" + (n + 1));
      if (e.key === "ArrowLeft") go(n > 1 ? "day/" + (n - 1) : "nights", { dir: "back" });
    }
  });

  NRUnlock.onChange(function (c, prev) {
    renderProgress();
    toast("Din " + c + " khul gaya. " + D.days[c - 1].goddess + " aapka intezaar kar rahi hain.");
    if (current && current.key === "nights") { var k = "nights"; var old = current; current = null; stage.removeChild(old.el); go(k, { dir: "fwd", fromPop: true }); }
  });

  /* ---------- boot ---------- */
  function boot() {
    document.title = C.title;
    NRPetals.init();
    NRMusic.init($("#btnMusic"), toast);
    NRUnlock.start();
    try { history.replaceState({ key: "welcome" }, "", location.href); } catch (e) {}
    go("welcome", { fromPop: true });
  }
  boot();
})();
