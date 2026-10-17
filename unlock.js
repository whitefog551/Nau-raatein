/* Daily unlocking in a fixed IANA time zone (default Asia/Kolkata).
   Day n unlocks at 00:00 on (startDate + n - 1) in that zone. Once unlocked it stays
   unlocked (the highest value seen is remembered in localStorage, so changing the
   device clock backwards cannot re-lock pages). */
(function () {
  var C = window.NR_CONTENT.config;
  var TZ = C.timeZone || "Asia/Kolkata";
  var STORE = "nr_max_unlocked_v2";
  var listeners = [];
  var timer = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // "YYYY-MM-DDTHH:MM:SS" for the given instant, as seen in TZ.
  function zonedISO(ms) {
    var f = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    });
    var o = {};
    f.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return o.year + "-" + o.month + "-" + o.day + "T" + o.hour + ":" + o.minute + ":" + o.second;
  }

  function addDays(ymd, n) {
    var p = ymd.split("-").map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
    return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
  }

  function normalise(key) { // accept "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM[:SS]"
    if (key.length === 10) return key + "T00:00:00";
    if (key.length === 16) return key + ":00";
    return key;
  }

  function dayKey(n) { return addDays(C.startDate, n - 1) + "T00:00:00"; }

  function preview() {
    if (C.forcePreview) return 9;
    if (!C.allowPreview) return null;
    var m = /[?&]preview=(\d+)/.exec(location.search);
    return m ? Math.max(0, Math.min(9, parseInt(m[1], 10))) : null;
  }

  function readStored() {
    try { return parseInt(localStorage.getItem(STORE), 10) || 0; } catch (e) { return 0; }
  }
  function writeStored(v) { try { localStorage.setItem(STORE, String(v)); } catch (e) {} }

  function nowISO() { return zonedISO(Date.now()); }

  function unlockedCount() {
    var pv = preview();
    if (pv !== null) return pv;
    var now = nowISO(), dateCount = 0;
    for (var n = 1; n <= 9; n++) if (now >= dayKey(n)) dateCount = n;
    // Never let stale preview/localStorage data unlock a future date-locked night.
    // Days 1–7 remain remembered, but the stored count is clamped to today's real date.
    var best = Math.max(Math.min(readStored(), dateCount), dateCount);
    if (best !== readStored()) writeStored(best);
    return best;
  }

  function isExtraUnlocked(extra) {
    var pv = preview();
    if (pv === 9) return true;
    return nowISO() >= normalise(extra.unlockAt);
  }

  function labelFor(key) { // "14 Oct, 12:00 AM IST"
    var ymd = key.slice(0, 10), hm = key.slice(11, 16);
    var d = new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10)));
    var date = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
    var h = +hm.slice(0, 2), ap = h >= 12 ? "PM" : "AM", h12 = h % 12 === 0 ? 12 : h % 12;
    return date + ", " + h12 + ":" + hm.slice(3) + " " + ap + (TZ === "Asia/Kolkata" ? " IST" : "");
  }

  function msToNextMidnight() {
    var t = nowISO(); // current time in zone
    var s = +t.slice(11, 13) * 3600 + +t.slice(14, 16) * 60 + +t.slice(17, 19);
    return (86400 - s) * 1000; // IST has no DST; for DST zones the 30s poll below corrects drift.
  }

  var last = null;
  function check() {
    var c = unlockedCount();
    if (last !== null && c !== last) listeners.forEach(function (fn) { fn(c, last); });
    last = c;
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    var ms = Math.min(msToNextMidnight() + 1000, 30000); // re-check at least every 30 s
    timer = setTimeout(check, ms);
  }

  document.addEventListener("visibilitychange", function () { if (!document.hidden) check(); });
  window.addEventListener("focus", check);

  window.NRUnlock = {
    count: unlockedCount,
    isDayUnlocked: function (n) {
      if (n <= 7) return true;
      var pv = preview(); if (pv === 9) return true;
      return n <= 9 && nowISO() >= dayKey(n);
    },
    dayLabel: function (n) { return labelFor(dayKey(n)); },
    dayShortDate: function (n) { return labelFor(dayKey(n)).split(",")[0]; },
    extraLabel: function (e) { return labelFor(normalise(e.unlockAt)); },
    isExtraUnlocked: isExtraUnlocked,
    isPreview: function () { return preview() !== null; },
    onChange: function (fn) { listeners.push(fn); },
    start: function () { last = unlockedCount(); schedule(); },
    zonedISO: zonedISO, nowISO: nowISO
  };
})();
