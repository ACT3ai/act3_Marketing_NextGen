/*
 * Step-by-Step Guide — page behavior shared by every walkthrough page (prompts/p_step_by_step_update.md).
 *
 *   * marks the steps before the current one as done in the left rail,
 *   * on a phone, scrolls the horizontal step strip so the current step is in view,
 *   * Left / Right arrow keys follow the page's Back / Continue links (not while typing),
 *   * a screenshot frame marked data-g-fit gets .is-tall when full width would push it past the
 *     screen, so the goal sentences and the top of the image stay in view together (A.2 item 3).
 *
 * No dependencies. Works without it: every control is a plain link.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // Rail: steps above the current one read as done.
    var steps = Array.prototype.slice.call(document.querySelectorAll(".g-step"));
    var cur = steps.findIndex(function (s) { return s.getAttribute("aria-current") === "step"; });
    steps.forEach(function (s, i) { if (cur > -1 && i < cur) s.classList.add("is-done"); });

    // Phone: keep the current step visible in the horizontal strip.
    var strip = document.querySelector(".g-steps");
    if (strip && cur > -1 && strip.scrollWidth > strip.clientWidth) {
      var li = steps[cur].parentElement;
      strip.scrollLeft = Math.max(0, li.offsetLeft - 16);
    }

    // Keyboard: Left = Back, Right = Continue.
    var next = document.querySelector("[data-g-next]");
    var prev = document.querySelector("[data-g-prev]");
    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight" && next) { window.location.href = next.href; }
      else if (e.key === "ArrowLeft" && prev) { window.location.href = prev.href; }
    });

    // Tall screenshots: narrow the frame instead of letting it run off the screen.
    var fits = document.querySelectorAll(".g-shot[data-g-fit]");
    function fit() {
      Array.prototype.forEach.call(fits, function (f) {
        var img = f.querySelector("img");
        if (!img || !img.naturalWidth) return;
        var ratio = img.naturalWidth / img.naturalHeight;
        f.style.setProperty("--g-shot-ratio", String(ratio));
        var fullH = f.parentElement.clientWidth / ratio;
        f.classList.toggle("is-tall", fullH > window.innerHeight * 0.95);
      });
    }
    Array.prototype.forEach.call(fits, function (f) {
      var img = f.querySelector("img");
      if (img && !img.complete) img.addEventListener("load", fit, { once: true });
    });
    fit();
    window.addEventListener("resize", fit);
  });
})();
