/* Optional background music. Never autoplays: audio is created/played only after the
   visitor presses the toggle. A missing or blocked file shows a gentle message. */
(function () {
  var audio = null, btn, toast, on = false, fadeT = null;

  function setUI(state) {
    on = state;
    btn.setAttribute("aria-pressed", state ? "true" : "false");
    btn.classList.toggle("is-on", state);
    btn.querySelector(".sr").textContent = state ? "Music band karein" : "Music chalayein";
  }
  function fade(to, done) {
    clearInterval(fadeT);
    fadeT = setInterval(function () {
      var v = audio.volume, step = 0.04;
      if (Math.abs(v - to) <= step) { audio.volume = to; clearInterval(fadeT); done && done(); }
      else audio.volume = v + (to > v ? step : -step);
    }, 60);
  }
  function play() {
    if (!audio) {
      audio = new Audio();
      audio.loop = true; audio.preload = "none"; audio.volume = 0;
      audio.addEventListener("error", function () {
        setUI(false); toast("Music file abhi jodi nahi gayi hai (assets/audio/navratri-ambient.mp3).");
      });
      audio.src = window.NR_CONTENT.config.music.src;
    }
    var p = audio.play();
    setUI(true);
    if (p && p.then) {
      p.then(function () { fade(0.35); }).catch(function () {
        setUI(false); toast("Music chal nahi paayi. File missing ho sakti hai ya browser ne roka.");
      });
    }
  }
  function pause() {
    setUI(false);
    if (audio) fade(0, function () { audio.pause(); });
  }
  window.NRMusic = {
    init: function (button, toastFn) {
      btn = button; toast = toastFn; setUI(false);
      btn.addEventListener("click", function () { on ? pause() : play(); });
      document.addEventListener("visibilitychange", function () { if (document.hidden && on && audio) audio.pause(); else if (!document.hidden && on && audio) audio.play().catch(function () {}); });
    }
  };
})();
