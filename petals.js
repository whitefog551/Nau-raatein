/* Floating petals on a fixed canvas. Light (≈16 petals), paused when the tab is hidden,
   and drawn once (static) when the visitor prefers reduced motion. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canvas, ctx, W = 0, H = 0, dpr = 1, petals = [], bursts = [], raf = null, running = false, last = 0;
  var COLOURS = ["#f4b6c2", "#f9d3da", "#e89aa9", "#f5c46b", "#fbe3b3", "#d9788f"];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function mk(initial) {
    return {
      x: rnd(0, W), y: initial ? rnd(-H * 0.1, H) : rnd(-60, -10), s: rnd(6, 12), r: rnd(0, 6.28),
      vr: rnd(-0.6, 0.6), vy: rnd(14, 30), sw: rnd(10, 26), ph: rnd(0, 6.28), c: COLOURS[(Math.random() * COLOURS.length) | 0], a: rnd(0.35, 0.7)
    };
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = W < 600 ? 10 : 16;
    while (petals.length < n) petals.push(mk(true));
    petals.length = n;
    if (reduce.matches) draw(0);
  }
  function shape(p, t) {
    ctx.save();
    ctx.translate(p.x + Math.sin(t * 0.0007 + p.ph) * p.sw, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.4, p.s * 0.7, p.s * 0.8, 0, p.s);
    ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.8, -p.s * 0.9, -p.s * 0.4, 0, -p.s);
    ctx.fill();
    ctx.restore();
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < petals.length; i++) shape(petals[i], t);
    for (var j = 0; j < bursts.length; j++) shape(bursts[j], t);
  }
  function tick(t) {
    if (!running) return;
    var dt = Math.min((t - last) / 1000 || 0.016, 0.05); last = t;
    petals.forEach(function (p, i) {
      p.y += p.vy * dt; p.r += p.vr * dt;
      if (p.y > H + 20) petals[i] = mk(false);
    });
    for (var i = bursts.length - 1; i >= 0; i--) {
      var b = bursts[i];
      b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 160 * dt; b.r += b.vr * dt; b.a -= dt * 0.35;
      if (b.a <= 0 || b.y > H + 30) bursts.splice(i, 1);
    }
    draw(t);
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (reduce.matches || running) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(tick);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  window.NRPetals = {
    init: function () {
      canvas = document.getElementById("petals"); ctx = canvas.getContext("2d");
      resize(); window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
      reduce.addEventListener && reduce.addEventListener("change", function () { reduce.matches ? (stop(), draw(0)) : start(); });
      start();
    },
    burst: function (x, y) {
      if (reduce.matches) return;
      for (var i = 0; i < 26; i++) {
        var a = rnd(-Math.PI, 0), v = rnd(120, 300);
        bursts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: rnd(6, 11), r: rnd(0, 6), vr: rnd(-3, 3), sw: 0, ph: 0, c: COLOURS[(Math.random() * COLOURS.length) | 0], a: 0.9 });
      }
      start();
    }
  };
})();
