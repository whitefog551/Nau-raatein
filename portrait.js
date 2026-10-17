/* Portrait reveal.
   Stage 1 (sketch): the graphite portrait is *drawn in* — darkest pencil strokes appear first
   (hair, eyes, brows), swept down the page in a wavy pencil-like path, then mid tones, then the
   lightest shading and paper grain. This is per-pixel ink ordering on a <canvas>, not a
   grayscale-to-colour crossfade.
   Stage 2 (colour): the coloured portrait is "painted" over the sketch with ~450 soft, rotated
   brush dabs that spread out from the face, accumulated in a mask canvas.
   If assets/img/portrait-colour.jpg is missing, a soft colour wash made from the sketch itself is
   used (and flagged to the visitor) — the real colour photo is never faked. */
(function () {
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  function load(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.decoding = "async";
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error("load failed: " + src)); };
      im.src = src;
    });
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function mount(frame, cfg, hooks) {
    hooks = hooks || {};
    var sk = frame.querySelector(".p-sketch"), co = frame.querySelector(".p-colour"), pencil = frame.querySelector(".p-pencil");
    var sctx = sk.getContext("2d", { willReadFrequently: true }), cctx = co.getContext("2d");
    var W, H, orig, tau, paper, mask, mctx, colourSrc, dabs, usingFallback = false;
    var raf = null, token = 0, ready = false, dabIndex = 0;
    var out;

    function stage(name) { hooks.onStage && hooks.onStage(name); }

    function buildTau(img) {
      var n = W * H, ink = new Float32Array(n);
      var d = orig.data, pr = paper[0], pg = paper[1], pb = paper[2];
      var pl = (pr * 0.3 + pg * 0.59 + pb * 0.11) / 255;
      // coarse noise grid -> wavy "hand" sweep
      var GX = 9, GY = 12, grid = [];
      for (var gy = 0; gy <= GY; gy++) { grid[gy] = []; for (var gx = 0; gx <= GX; gx++) grid[gy][gx] = Math.random(); }
      tau = new Float32Array(n);
      for (var y = 0, i = 0; y < H; y++) {
        var fy = y / H * GY, iy = Math.floor(fy), ty = fy - iy;
        for (var x = 0; x < W; x++, i++) {
          var j = i * 4, L = (d[j] * 0.3 + d[j + 1] * 0.59 + d[j + 2] * 0.11) / 255;
          var inkv = clamp((pl - L) / pl / 0.7, 0, 1);          // 0 = paper, 1 = dark graphite
          var fx = x / W * GX, ix = Math.floor(fx), tx = fx - ix;
          var nz = grid[iy][ix] * (1 - tx) * (1 - ty) + grid[iy][ix + 1] * tx * (1 - ty) + grid[iy + 1][ix] * (1 - tx) * ty + grid[iy + 1][ix + 1] * tx * ty;
          var sweep = clamp(0.5 * (y / H) + 0.2 * (x / W) + 0.3 * nz, 0, 1);
          tau[i] = 0.62 * (1 - inkv) + 0.33 * sweep + Math.random() * 0.02;
        }
      }
    }

    function paintSketch(p) { // p: 0..1
      var d = orig.data, o = out.data, n = W * H, pp = p * 1.12, inv = 1 / 0.1;
      var pr = paper[0], pg = paper[1], pb = paper[2];
      for (var i = 0, j = 0; i < n; i++, j += 4) {
        var a = (pp - tau[i]) * inv;
        if (a <= 0) { o[j] = pr; o[j + 1] = pg; o[j + 2] = pb; }
        else if (a >= 1) { o[j] = d[j]; o[j + 1] = d[j + 1]; o[j + 2] = d[j + 2]; }
        else { o[j] = pr + (d[j] - pr) * a; o[j + 1] = pg + (d[j + 1] - pg) * a; o[j + 2] = pb + (d[j + 2] - pb) * a; }
        o[j + 3] = 255;
      }
      sctx.putImageData(out, 0, 0);
    }

    function movePencil(p, visible) {
      if (!pencil) return;
      pencil.style.opacity = visible ? "1" : "0";
      var x = 50 + 36 * Math.sin(p * 38), y = 4 + 90 * p;
      pencil.style.left = x + "%"; pencil.style.top = y + "%";
    }

    function makeFallbackColour() {
      var c = document.createElement("canvas"); c.width = W; c.height = H;
      var g = c.getContext("2d");
      g.drawImage(sk.__img, 0, 0, W, H);
      g.globalCompositeOperation = "multiply";
      var base = g.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0, "rgba(255,226,218,1)"); base.addColorStop(0.6, "rgba(252,214,206,1)"); base.addColorStop(1, "rgba(238,196,200,1)");
      g.fillStyle = base; g.fillRect(0, 0, W, H);
      var face = g.createRadialGradient(W * 0.48, H * 0.4, 0, W * 0.48, H * 0.4, H * 0.2);
      face.addColorStop(0, "rgba(255,196,160,0.95)"); face.addColorStop(1, "rgba(255,196,160,0)");
      g.fillStyle = face; g.fillRect(0, 0, W, H);
      var cloth = g.createLinearGradient(0, H * 0.74, 0, H);
      cloth.addColorStop(0, "rgba(255,255,255,0)"); cloth.addColorStop(1, "rgba(176,58,88,0.9)");
      g.fillStyle = cloth; g.fillRect(0, H * 0.72, W, H * 0.28);
      var halo = g.createRadialGradient(W * 0.5, H * 0.45, W * 0.3, W * 0.5, H * 0.45, W * 0.85);
      halo.addColorStop(0, "rgba(255,255,255,0)"); halo.addColorStop(1, "rgba(245,190,160,0.55)");
      g.fillStyle = halo; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "source-over";
      return c;
    }

    function drawCover(ctx, im) { // object-fit: cover into W x H
      var r = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r;
      ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    }

    function buildDabs() {
      dabs = [];
      var cols = 18, cell = W / cols, rows = Math.ceil(H / cell), cx = W * 0.48, cy = H * 0.4;
      for (var r = -1; r <= rows; r++) for (var c = -1; c <= cols; c++) {
        var x = (c + 0.5) * cell + (Math.random() - 0.5) * cell * 0.8, y = (r + 0.5) * cell + (Math.random() - 0.5) * cell * 0.8;
        var dist = Math.hypot((x - cx) / W, (y - cy) / H) * (0.8 + Math.random() * 0.4);
        dabs.push({ x: x, y: y, d: dist, a: Math.random() * Math.PI, s: cell * (1.5 + Math.random() * 0.6) });
      }
      dabs.sort(function (a, b) { return a.d - b.d; });
    }
    function addDab(d) {
      mctx.save(); mctx.translate(d.x, d.y); mctx.rotate(d.a); mctx.scale(1, 0.5);
      var g = mctx.createRadialGradient(0, 0, 0, 0, 0, d.s);
      g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.6, "rgba(0,0,0,0.92)"); g.addColorStop(1, "rgba(0,0,0,0)");
      mctx.fillStyle = g; mctx.beginPath(); mctx.arc(0, 0, d.s, 0, 6.2832); mctx.fill(); mctx.restore();
    }
    function renderColour(full) {
      cctx.globalCompositeOperation = "source-over";
      cctx.clearRect(0, 0, W, H);
      if (colourSrc.tagName === "IMG") drawCover(cctx, colourSrc); else cctx.drawImage(colourSrc, 0, 0);
      if (!full) { cctx.globalCompositeOperation = "destination-in"; cctx.drawImage(mask, 0, 0); cctx.globalCompositeOperation = "source-over"; }
    }

    function reset() {
      token++; if (raf) cancelAnimationFrame(raf);
      paintSketch(0); cctx.clearRect(0, 0, W, H);
      mctx.clearRect(0, 0, W, H); dabIndex = 0; movePencil(0, false);
    }
    function showFinal() {
      token++; if (raf) cancelAnimationFrame(raf);
      paintSketch(1); renderColour(true); movePencil(1, false); stage("done");
    }

    function play() {
      if (!ready) return;
      if (reduceMQ.matches) { showFinal(); return; }
      reset();
      var my = token, T1 = 7500, T2 = 4800, PAUSE = 500, t0 = performance.now(), phase = 1, lastDraw = 0;
      stage("sketch");
      function frame(now) {
        if (my !== token) return;
        var t = now - t0;
        if (phase === 1) {
          var p = clamp(t / T1, 0, 1);
          if (now - lastDraw > 32 || p >= 1) { paintSketch(ease(p)); lastDraw = now; }
          movePencil(ease(p), p < 1);
          if (p >= 1) { phase = 2; t0 = now + PAUSE; stage("colour"); }
        } else if (t >= 0) {
          var q = clamp(t / T2, 0, 1), target = Math.floor(ease(q) * dabs.length);
          if (target > dabIndex) {
            while (dabIndex < target) addDab(dabs[dabIndex++]);
            renderColour(false);
          }
          if (q >= 1) { renderColour(true); stage("done"); return; }
        }
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
    }

    // ---- init
    load(cfg.sketch).then(function (img) {
      var maxW = window.innerWidth < 700 ? 640 : 760;
      W = Math.min(img.naturalWidth, maxW); H = Math.round(W * img.naturalHeight / img.naturalWidth);
      [sk, co].forEach(function (c) { c.width = W; c.height = H; });
      frame.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
      sk.__img = img;
      sctx.drawImage(img, 0, 0, W, H);
      orig = sctx.getImageData(0, 0, W, H); out = sctx.createImageData(W, H);
      // paper colour = mean of a small top-right patch
      var px = 0, py = 0, cnt = 0, pr = 0, pg = 0, pb = 0;
      for (py = 4; py < 44; py++) for (px = W - 44; px < W - 4; px++) { var k = (py * W + px) * 4; pr += orig.data[k]; pg += orig.data[k + 1]; pb += orig.data[k + 2]; cnt++; }
      paper = [pr / cnt, pg / cnt, pb / cnt];
      buildTau(img);
      var m = document.createElement("canvas"); m.width = W; m.height = H; mask = m; mctx = m.getContext("2d");
      buildDabs();
      return load(cfg.colour).then(function (ci) { colourSrc = ci; }, function () { usingFallback = true; colourSrc = makeFallbackColour(); });
    }).then(function () {
      ready = true; hooks.onReady && hooks.onReady({ fallback: usingFallback });
      play();
    }).catch(function () { hooks.onError && hooks.onError(); });

    return {
      play: play, showFinal: showFinal,
      destroy: function () { token++; if (raf) cancelAnimationFrame(raf); }
    };
  }

  window.NRPortrait = { mount: mount };
})();
