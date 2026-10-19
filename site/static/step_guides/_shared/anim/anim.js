/*
 * GuideAnim — a small screenshot animator for the Step-by-Step Guide pages.
 *
 * It lays animated HTML over a still screenshot, in the screenshot's own pixel coordinates, the way
 * homepage row 4 ("Editor Proof") animates the real ACT 3 editor: a cursor moves and clicks, the chat
 * box turns white and types, a post appears, the AI answers, a pane flashes, the view switches.
 *
 * Usage (see _shared/TEMPLATE_page.html):
 *
 *   <figure class="g-shot">
 *     <div class="ga-stage" id="anim-1"><img class="ga-base" src="img/editor.jpg" alt="..."></div>
 *   </figure>
 *   <script src="../_shared/anim/anim.js"></script>
 *   <script>
 *     GuideAnim.play("#anim-1", {
 *       w: 5504, h: 3072,            // the coordinate space of every box below (the image's own pixels)
 *       still: [{ ring: [x, y, w, h], label: "Post" }],   // what reduced motion shows, no movement
 *       steps: [
 *         { cursor: [x, y] },                   // move the pointer (ms: 700 default)
 *         { click: true },                      // press ripple at the pointer
 *         { ring: [x, y, w, h], label: "Post" },// pulsing highlight (below: true puts the label under)
 *         { unring: true },
 *         { type: "Show me the storyboard", box: [x, y, w, h], post: [x, y, w, h] },
 *         { say: "Show me the storyboard", log: [x, y, w, h] },   // the person's post in the chat log
 *         { reply: "Here it is.", log: [x, y, w, h] },            // "Generating…" blinks, then the AI
 *         { flash: [x, y, w, h] },              // a pane flashes bright as it updates
 *         { layer: "img/b.jpg", box: [x, y, w, h], mode: "wipe" },// a region's picture changes
 *         { swap: "img/next.jpg", mode: "scan" },// the whole screen becomes another screenshot
 *         { swap: "img/wide.jpg", fit: "contain" },  // keep a different-shaped screenshot whole (letterboxed)
 *         { hl: [x, y, w, h] }, { unhl: true },  // a pressed menu-bar trigger
 *         { menu: { at: [x, y], w: 1100, fs: 44, items: ["Columns ›", "✓ Show Sets", "—", "Visual Debugger|D"] } },
 *         { menuHover: 2 }, { unmenu: true },     // pointer moves to menu row 2 (separators not counted) and lights it
 *         { progress: [x, y, w, h], label: "Importing", ms: 1500 },
 *         { sparkle: { from: [x, y], to: [x, y] } },
 *         { zoom: [x, y, w, h] }, { unzoom: true },
 *         { caption: "Click Post" }, { caption: null },
 *         { wait: 1200 },
 *       ],
 *       loop: true, pause: 2200,
 *     });
 *   </script>
 *
 * GuideAnim.EDITOR holds the ACT 3 editor screenshot (homepage row 4's) and the boxes of its parts, so
 * an editor animation can be written as GuideAnim.play(el, GuideAnim.editor({ steps: [...] })).
 *
 * The animation runs only while the stage is on screen, and never under prefers-reduced-motion (the
 * still state is drawn instead). Every step is optional; unknown keys are ignored.
 */
(function () {
  "use strict";

  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || "";
  var KIT_BASE = SCRIPT_SRC.replace(/anim\/anim\.js(?:\?.*)?$/, "");

  // Load anim.css next to this file once.
  (function () {
    if (document.querySelector("link[data-ga-css]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = KIT_BASE + "anim/anim.css";
    l.setAttribute("data-ga-css", "");
    document.head.appendChild(l);
  })();

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function Stage(root, opts) {
    this.root = root;
    this.o = opts;
    this.W = opts.w;
    this.H = opts.h;
    this.visible = false;
    this.waiters = [];
    root.classList.add("ga-stage");
    root.style.aspectRatio = this.W + " / " + this.H;

    var base = root.querySelector("img.ga-base");
    this.inner = el("div", "ga-inner");
    root.insertBefore(this.inner, base || root.firstChild);
    if (base) this.inner.appendChild(base);
    this.base = base;
    this.baseSrc = base ? base.getAttribute("src") : "";
    this.ov = el("div", "ga-ov-root", this.inner);
    this.cursorEl = el("div", "ga-cursor", this.inner); // inside the zoom layer, so it points true while zoomed
    this.cursorEl.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.5l15 9.2-6.6 1.4 3.9 7.4-3 1.6-3.9-7.5L4.6 19z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    this.captionEl = el("div", "ga-caption", root);
    this.cx = this.W * 0.5;
    this.cy = this.H * 0.62;

    var self = this;
    function scale() { root.style.setProperty("--ga-k", String(root.clientWidth / self.W)); }
    scale();
    if (window.ResizeObserver) new ResizeObserver(scale).observe(root);
    else window.addEventListener("resize", scale);
  }

  Stage.prototype.box = function (e, b) {
    e.style.left = (b[0] / this.W) * 100 + "%";
    e.style.top = (b[1] / this.H) * 100 + "%";
    e.style.width = (b[2] / this.W) * 100 + "%";
    e.style.height = (b[3] / this.H) * 100 + "%";
    return e;
  };
  Stage.prototype.fs = function (e, px) { e.style.setProperty("--ga-fs", String(px)); return e; };

  // Sleep that holds while the stage is off screen, and dies when the run is cancelled.
  Stage.prototype.sleep = function (ms, token) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var left = ms, last = performance.now();
      function tick() {
        if (token.dead) return reject(new Error("cancelled"));
        var now = performance.now();
        if (self.visible) left -= now - last;
        last = now;
        if (left <= 0) resolve();
        else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  };

  Stage.prototype.reset = function () {
    this.ov.innerHTML = "";
    this.inner.style.transform = "";
    this.inner.style.transition = "";
    this.root.style.removeProperty("--ga-z");
    if (this.base && this.base.getAttribute("src") !== this.baseSrc) this.base.setAttribute("src", this.baseSrc);
    if (this.base) this.base.style.objectFit = "";
    this.root.classList.remove("has-menu");
    this.menuEl = null;
    this.captionEl.classList.remove("is-on");
    this.cursorEl.classList.remove("is-on");
    this.cx = this.W * 0.5;
    this.cy = this.H * 0.62;
    this.placeCursor(0);
    this.logs = {};
  };

  Stage.prototype.placeCursor = function (ms) {
    this.cursorEl.style.transitionDuration = ms + "ms";
    this.cursorEl.style.left = (this.cx / this.W) * 100 + "%";
    this.cursorEl.style.top = (this.cy / this.H) * 100 + "%";
  };

  Stage.prototype.ring = function (s) {
    var r = this.box(el("div", "ga-ring", this.ov), s.ring);
    if (s.label) {
      var lab = el("span", "ga-ring-label" + (s.below ? " is-below" : ""), r);
      lab.textContent = s.label;
    }
    return r;
  };

  Stage.prototype.logFor = function (b) {
    var key = b.join(",");
    if (!this.logs[key]) {
      var lg = this.box(el("div", "ga-log", this.ov), b);
      this.fs(lg, this.o.chatFs || Math.max(18, this.H * 0.0155));
      this.logs[key] = lg;
    }
    return this.logs[key];
  };

  // A dropdown menu under a menu-bar trigger. m = { at: [x, y], w, fs, items: [...] }; an item is a
  // label, "—" for a separator, "label|D" for a shortcut, a trailing " ›" for a submenu, "✓ label" checked.
  Stage.prototype.menu = function (m) {
    var mn = el("div", "ga-menu", this.ov);
    mn.style.left = (m.at[0] / this.W) * 100 + "%";
    mn.style.top = (m.at[1] / this.H) * 100 + "%";
    mn.style.width = ((m.w || 1100) / this.W) * 100 + "%";
    this.fs(mn, m.fs || 44);
    m.items.forEach(function (it) {
      if (it === "—") { el("div", "ga-menu-sep", mn); return; }
      var row = el("div", "ga-menu-item", mn), parts = String(it).split("|");
      var label = parts[0], sub = / ›$/.test(label);
      if (sub) label = label.replace(/ ›$/, "");
      var check = /^✓ /.test(label);
      if (check) label = label.slice(2);
      el("span", "ga-menu-check", row).textContent = check ? "✓" : "";
      el("span", "ga-menu-label", row).textContent = label;
      el("span", "ga-menu-key", row).textContent = sub ? "›" : parts[1] || "";
    });
    this.root.classList.add("has-menu");
    this.menuEl = mn;
    return mn;
  };

  /** Highlight menu row i (separators not counted); returns its center in image pixels. */
  Stage.prototype.menuHot = function (i) {
    if (!this.menuEl) return null;
    var rows = this.menuEl.querySelectorAll(".ga-menu-item");
    Array.prototype.forEach.call(rows, function (r, k) { r.classList.toggle("is-hot", k === i); });
    var r = rows[i];
    if (!r) return null;
    var iw = this.inner.clientWidth || 1, ih = this.inner.clientHeight || 1;
    var x = this.menuEl.offsetLeft + r.offsetLeft + r.offsetWidth * 0.32;
    var y = this.menuEl.offsetTop + r.offsetTop + r.offsetHeight * 0.55;
    return [(x / iw) * this.W, (y / ih) * this.H];
  };

  Stage.prototype.drawStill = function () {
    var self = this;
    (this.o.still || []).forEach(function (s) {
      if (s.hl) self.box(el("div", "ga-hl", self.ov), s.hl);
      if (s.menu) self.menu(s.menu);
      if (s.menuHover !== undefined) self.menuHot(s.menuHover);
      if (s.ring) self.ring(s);
      if (s.caption) { self.captionEl.textContent = s.caption; self.captionEl.classList.add("is-on"); }
      if (s.swap && self.base) self.base.setAttribute("src", s.swap);
    });
  };

  Stage.prototype.run = async function (token) {
    var self = this, o = this.o;
    for (;;) {
      this.reset();
      await this.sleep(o.lead || 600, token);
      for (var i = 0; i < o.steps.length; i++) {
        await this.step(o.steps[i], token);
      }
      await this.sleep(o.pause || 2200, token);
      if (o.loop === false) return;
      this.root.classList.add("is-fading");
      await this.sleep(380, token);
      this.root.classList.remove("is-fading");
    }
  };

  Stage.prototype.step = async function (s, token) {
    var self = this;
    if (s.wait) return this.sleep(s.wait, token);

    if (s.caption !== undefined) {
      if (s.caption) { this.captionEl.textContent = s.caption; this.captionEl.classList.add("is-on"); }
      else this.captionEl.classList.remove("is-on");
      if (!s.cursor && !s.ring) return this.sleep(s.ms || 0, token);
    }

    if (s.cursor) {
      var ms = s.ms || 750;
      this.cursorEl.classList.add("is-on");
      this.cx = s.cursor[0];
      this.cy = s.cursor[1];
      this.placeCursor(ms);
      await this.sleep(ms + 80, token);
    }

    if (s.click) {
      this.cursorEl.classList.add("is-on", "is-press");
      var rp = el("span", "ga-ripple", this.ov);
      rp.style.left = (this.cx / this.W) * 100 + "%";
      rp.style.top = (this.cy / this.H) * 100 + "%";
      await this.sleep(180, token);
      this.cursorEl.classList.remove("is-press");
      await this.sleep(s.ms || 420, token);
      rp.remove();
      return;
    }

    if (s.ring) { this.ring(s); return this.sleep(s.ms || 900, token); }
    if (s.unring) { this.ov.querySelectorAll(".ga-ring").forEach(function (r) { r.remove(); }); return; }

    if (s.type !== undefined) {
      var b = s.box;
      var bx = this.box(el("div", "ga-input", this.ov), b);
      this.fs(bx, s.fs || b[3] * 0.4);
      var txt = el("span", "ga-input-text", bx);
      var caret = el("span", "ga-caret", bx);
      void caret;
      if (s.post) {
        var p = el("span", "ga-post", this.ov);
        this.box(p, s.post);
        this.fs(p, s.fs || s.post[3] * 0.42);
        p.textContent = s.postLabel || "Post";
      }
      bx.classList.add("is-pulse");
      await this.sleep(700, token);
      bx.classList.remove("is-pulse");
      bx.classList.add("is-live");
      var text = String(s.type), per = (s.ms || Math.min(1800, 45 * text.length)) / Math.max(1, text.length);
      for (var c = 1; c <= text.length; c++) {
        txt.textContent = text.slice(0, c);
        await this.sleep(per, token);
      }
      await this.sleep(s.hold || 350, token);
      if (s.post) {
        var pe = this.ov.querySelector(".ga-post:last-of-type");
        if (pe) pe.classList.add("is-press");
        await this.sleep(240, token);
      }
      if (s.keep) return;
      bx.remove();
      this.ov.querySelectorAll(".ga-post").forEach(function (x) { x.remove(); });
      return;
    }

    if (s.say) {
      var lg = this.logFor(s.log);
      var m = el("div", "ga-msg ga-msg-me", lg);
      el("span", "ga-who", m).textContent = s.who || "You";
      el("span", "ga-said", m).textContent = s.say;
      return this.sleep(s.ms || 500, token);
    }

    if (s.reply) {
      var lg2 = this.logFor(s.log);
      var a = el("div", "ga-msg ga-msg-ai", lg2);
      el("span", "ga-who", a).textContent = s.who || "AI";
      var body = el("span", "ga-said ga-thinking", a);
      body.textContent = "Generating…";
      await this.sleep(s.think || 1000, token);
      body.classList.remove("ga-thinking");
      body.textContent = s.reply;
      return this.sleep(s.ms || 700, token);
    }

    if (s.hl) { this.box(el("div", "ga-hl", this.ov), s.hl); return this.sleep(s.ms || 150, token); }
    if (s.unhl) { this.ov.querySelectorAll(".ga-hl").forEach(function (h) { h.remove(); }); return; }

    if (s.menu) { this.menu(s.menu); return this.sleep(s.ms || 500, token); }
    if (s.menuHover !== undefined) {
      var at = this.menuHot(s.menuHover);
      if (at) {
        var mms = s.ms || 450;
        this.cursorEl.classList.add("is-on");
        this.cx = at[0];
        this.cy = at[1];
        this.placeCursor(mms);
        await this.sleep(mms + 60, token);
      }
      return this.sleep(s.hold || 300, token);
    }
    if (s.unmenu) {
      if (this.menuEl) { this.menuEl.remove(); this.menuEl = null; }
      this.root.classList.remove("has-menu");
      return;
    }

    if (s.flash) {
      var f = this.box(el("div", "ga-flash", this.ov), s.flash);
      await this.sleep(s.ms || 850, token);
      f.remove();
      return;
    }

    if (s.layer) {
      var holder = this.box(el("div", "ga-layer ga-layer-" + (s.mode || "fade"), this.ov), s.box);
      var li = el("img", "", holder);
      li.alt = "";
      li.src = s.layer;
      await new Promise(function (r) { if (li.complete) r(); else { li.onload = r; li.onerror = r; } });
      requestAnimationFrame(function () { holder.classList.add("is-in"); });
      return this.sleep(s.ms || 900, token);
    }

    if (s.swap) {
      var top = el("img", "ga-swap ga-swap-" + (s.mode || "fade"), this.inner);
      top.alt = "";
      if (s.fit) top.style.objectFit = s.fit; // "contain" keeps a screenshot of another shape whole
      top.src = s.swap;
      await new Promise(function (r) { if (top.complete) r(); else { top.onload = r; top.onerror = r; } });
      requestAnimationFrame(function () { top.classList.add("is-in"); });
      await this.sleep(s.ms || 800, token);
      if (this.base) this.base.setAttribute("src", s.swap);
      if (this.base && s.fit) this.base.style.objectFit = s.fit;
      this.ov.innerHTML = "";
      this.logs = {};
      top.remove();
      return;
    }

    if (s.progress) {
      var pg = this.box(el("div", "ga-progress", this.ov), s.progress);
      this.fs(pg, s.fs || Math.max(16, s.progress[3] * 0.2));
      var row = el("div", "ga-progress-row", pg);
      el("span", "ga-progress-label", row).textContent = s.label || "Working";
      var pct = el("span", "ga-progress-pct", row);
      var bar = el("div", "ga-progress-bar", pg);
      var fill = el("span", "", bar);
      var dur = s.ms || 1400, t0 = 0, steps = 24;
      for (var k = 0; k <= steps; k++) {
        t0 = k / steps;
        fill.style.width = t0 * 100 + "%";
        pct.textContent = Math.round(t0 * 100) + "%";
        await this.sleep(dur / steps, token);
      }
      await this.sleep(250, token);
      if (!s.keep) pg.remove();
      return;
    }

    if (s.sparkle) {
      var cv = el("canvas", "ga-sparks", this.ov);
      var w = (cv.width = this.root.clientWidth * (window.devicePixelRatio || 1));
      var h = (cv.height = this.root.clientHeight * (window.devicePixelRatio || 1));
      var ctx = cv.getContext("2d");
      var fx = (s.sparkle.from[0] / this.W) * w, fy = (s.sparkle.from[1] / this.H) * h;
      var tx = (s.sparkle.to[0] / this.W) * w, ty = (s.sparkle.to[1] / this.H) * h;
      var n = 60, parts = [];
      var seed = 7;
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var q = 0; q < n; q++) parts.push({ d: rnd() * 0.45, arc: (rnd() - 0.5) * h * 0.5, r: 1 + rnd() * 2.6 });
      var D = s.ms || 1100, start = performance.now();
      await new Promise(function (resolve) {
        function frame(now) {
          if (token.dead) return resolve();
          var u = (now - start) / D;
          ctx.clearRect(0, 0, w, h);
          parts.forEach(function (p) {
            var v = Math.min(1, Math.max(0, (u - p.d) / 0.55));
            if (v <= 0 || v >= 1) return;
            var e = v * v * (3 - 2 * v);
            var x = fx + (tx - fx) * e, y = fy + (ty - fy) * e - Math.sin(Math.PI * e) * p.arc;
            ctx.globalAlpha = Math.sin(Math.PI * v);
            ctx.fillStyle = "#fcd648";
            ctx.shadowColor = "#eebc3c";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, p.r * (window.devicePixelRatio || 1), 0, Math.PI * 2);
            ctx.fill();
          });
          if (u < 1.05) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      cv.remove();
      return;
    }

    if (s.zoom) {
      var z = s.zoom, sc = Math.min(this.W / z[2], this.H / z[3]);
      var ox = -(z[0] + z[2] / 2 - this.W / (2 * sc)) / this.W * 100;
      var oy = -(z[1] + z[3] / 2 - this.H / (2 * sc)) / this.H * 100;
      ox = Math.min(0, Math.max(ox, -(100 - 100 / sc)));
      oy = Math.min(0, Math.max(oy, -(100 - 100 / sc)));
      this.inner.style.transition = "transform " + (s.ms || 900) + "ms cubic-bezier(.4,0,.2,1)";
      this.inner.style.transform = "scale(" + sc + ") translate(" + ox + "%," + oy + "%)";
      this.root.style.setProperty("--ga-z", String(sc)); // keeps the 11px text floor true on screen while zoomed
      return this.sleep((s.ms || 900) + 100, token);
    }
    if (s.unzoom) {
      this.inner.style.transition = "transform " + (s.ms || 900) + "ms cubic-bezier(.4,0,.2,1)";
      this.inner.style.transform = "";
      this.root.style.removeProperty("--ga-z");
      return this.sleep((s.ms || 900) + 100, token);
    }
  };

  function play(target, opts) {
    var root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) return;
    var st = new Stage(root, opts);
    if (reduce || !opts.steps || !opts.steps.length) { st.reset(); st.drawStill(); return st; }
    var token = { dead: false }, started = false;
    function start() {
      if (started) return;
      started = true;
      st.run(token).catch(function () {});
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          st.visible = e.isIntersecting;
          if (e.isIntersecting) start();
        });
      }, { threshold: 0.25 }).observe(root);
    } else { st.visible = true; start(); }
    document.addEventListener("visibilitychange", function () { if (document.hidden) st.visible = false; });
    return st;
  }

  // ── The ACT 3 editor (homepage row 4's screenshot, 5504 x 3072 coordinate space) ──
  var E = KIT_BASE + "editor_anim/img/";
  var EDITOR = {
    w: 5504,
    h: 3072,
    src: E + "editor.jpg",               // the editor, Harbor Street, shot 71 "Nora and the Lunch Box"
    storyboard: E + "storyboard.jpg",    // the Storyboard view of the same film (5504 x 2674 original)
    kitchen: E + "kitchen.jpg",          // the shot's picture now
    beach: E + "beach.jpg",              // the same actor on a Maui beach (homepage point 1)
    boxes: {
      timeline: [262, 300, 5222, 384],   // Acts, Beats, Scenes, Shots
      shot71: [3833, 578, 543, 74],      // the selected shot on the timeline
      shot72: [4403, 578, 523, 74],
      toggle: [4922, 190, 548, 94],      // Video | Storyboard
      shot: [28, 810, 2266, 1042],       // THE SHOT player
      history: [40, 1978, 2256, 246],    // GENERATION HISTORY strip
      prompt: [28, 2284, 1514, 757],     // THE PROMPT
      references: [1610, 2394, 647, 647],
      buildVideo: [2546, 858, 179, 83],  // Build: Video tab
      buildFirstFrame: [2752, 858, 261, 83], // Build: First Frame tab
      generate: [2372, 1115, 1577, 96],  // Generate Video this shot
      chatTab: [2738, 710, 179, 74],     // AI Chat tab
      log: [2330, 1506, 1662, 538],      // the AI CHAT messages
      input: [2360, 2076, 1590, 134],    // "Tell your AI filmmaker what to change…"
      post: [3646, 2092, 289, 96],       // Post
      firstFrame: [2636, 2377, 1026, 573],   // FIRST FRAME image
      firstFrameEdit: [3509, 2279, 129, 74], // FIRST FRAME "Edit"
      script: [4006, 826, 1480, 2090],   // SCRIPT pane
      scriptShot: [4026, 836, 1440, 410],// the highlighted SHOT 71 block in the script
      nextShot: [3866, 41, 41, 83],      // the ">" after the shot name in the top bar
      goTo: [4211, 33, 303, 99]          // Go to
    }
  };

  /** Merge editor defaults into a play() options object. */
  function editor(opts) {
    var o = {};
    for (var k in opts) o[k] = opts[k];
    o.w = EDITOR.w;
    o.h = EDITOR.h;
    if (!o.chatFs) o.chatFs = 60;
    return o;
  }

  window.GuideAnim = { play: play, editor: editor, EDITOR: EDITOR, KIT_BASE: KIT_BASE };
})();
