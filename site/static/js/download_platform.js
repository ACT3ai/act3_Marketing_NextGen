/*
 * download_platform.js — ONE shared file, serving BOTH marketing pages.
 * ---------------------------------------------------------------------
 *   /cli/  -> https://ACT3ai.com/cli/   -> repo ACT3ai/cli, binary "act3"
 *   /mcp/  -> https://ACT3ai.com/mcp/   -> repo ACT3ai/mcp, binary "act3-mcp"
 *
 * MASTER COPY (source of truth, edit this one):
 *   ~/BGit/all/film/marketing/ACT3_marketing_Home/download_platform.js
 * SERVED COPY (byte-identical, generated — do not hand-edit):
 *   ~/BGit/act3/act3_Marketing_NextGen/site/static/js/download_platform.js
 *   served at /js/download_platform.js
 *
 * THE ONE-COPY RULE: there is exactly one download_platform.js in the site.
 * Never fork this per page. The only thing that differs between the two pages
 * is DATA, in the PAGES lookup below. Everything else is shared code.
 *
 * DOM CONTRACT — the pages and this file must agree on these names exactly:
 *   [data-act3-download-page]  on the download button. Value is "cli" or "mcp".
 *                              This is the primary page-detection signal.
 *   #act3-download-btn         the main orange download button (an <a>).
 *   #act3-download-label       span inside the button holding the label text.
 *   #act3-clone-cmd            element whose textContent is the git clone command.
 *   #act3-copy-btn             the clipboard icon button.
 *   #act3-copy-tip             the tooltip element next to the clipboard icon.
 *   #act3-os-list              container for the per-OS download links.
 *
 * ENTRY POINT: window.ACT3DownloadPlatform.init()
 * Nothing runs at import time.
 */
(function () {
  "use strict";

  /* ---- The ONLY per-page difference: data, not code. ---- */
  var PAGES = {
    cli: { repo: "ACT3ai/cli", binary: "act3", branch: "main" },
    mcp: { repo: "ACT3ai/mcp", binary: "act3-mcp", branch: "main" }
  };

  /* ---- Platforms. Mirrors bin/<os>-<arch>/ in both repos. ---- */
  var PLATFORMS = [
    { id: "darwin-arm64", os: "mac", arch: "arm64", label: "Mac (Apple Silicon)" },
    { id: "darwin-amd64", os: "mac", arch: "amd64", label: "Mac (Intel)" },
    { id: "windows-amd64", os: "windows", arch: "amd64", label: "Windows (x64)" },
    { id: "windows-arm64", os: "windows", arch: "arm64", label: "Windows (ARM64)" },
    { id: "linux-amd64", os: "linux", arch: "amd64", label: "Linux (x64)" },
    { id: "linux-arm64", os: "linux", arch: "arm64", label: "Linux (ARM64)" }
  ];

  var COPY_IDLE = "Copy to clipboard";
  var COPY_DONE = "Copied to clipboard";

  function byId(id) {
    return document.getElementById(id);
  }

  /* ---- Which page are we on? Button attribute, then URL, then element ids. ---- */
  function detectPage() {
    var el = document.querySelector("[data-act3-download-page]");
    if (el) {
      var key = (el.getAttribute("data-act3-download-page") || "").trim().toLowerCase();
      if (PAGES[key]) return key;
    }
    var path = (window.location && window.location.pathname) || "";
    if (/(^|\/)mcp(\/|$)/.test(path)) return "mcp";
    if (/(^|\/)cli(\/|$)/.test(path)) return "cli";
    if (byId("act3-mcp-page")) return "mcp";
    if (byId("act3-cli-page")) return "cli";
    return null; // Fail safe. Never guess — a wrong guess ships the wrong binary.
  }

  function isWindows(ua, plat) {
    return /win/i.test(plat) || /windows/i.test(ua);
  }
  function isMac(ua, plat) {
    return /mac/i.test(plat) || /mac os x|macintosh/i.test(ua);
  }
  function isLinux(ua, plat) {
    return /linux/i.test(plat) || /linux|x11/i.test(ua);
  }

  function archFromHints(hints) {
    var a = (hints && hints.architecture) || "";
    if (/arm/i.test(a)) return "arm64";
    if (/x86|amd/i.test(a)) return "amd64";
    return null;
  }

  function archFromUA(ua, plat, os) {
    if (/arm64|aarch64/i.test(ua) || /arm/i.test(plat)) return "arm64";
    if (/x86_64|x64|win64|amd64|wow64/i.test(ua)) return "amd64";
    // Apple Silicon is invisible to the UA string, so default Mac to arm64.
    if (os === "mac") return "arm64";
    return "amd64"; // Windows and Linux default.
  }

  function detectPlatform(hints) {
    var nav = window.navigator || {};
    var ua = nav.userAgent || "";
    var plat = (hints && hints.platform) || nav.platform || "";
    var os = null;
    if (isWindows(ua, plat)) os = "windows";
    else if (isMac(ua, plat)) os = "mac";
    else if (isLinux(ua, plat)) os = "linux";
    if (!os) return null;

    var arch = archFromHints(hints) || archFromUA(ua, plat, os);
    return findPlatform(os, arch) || findPlatform(os, "amd64") || null;
  }

  function findPlatform(os, arch) {
    for (var i = 0; i < PLATFORMS.length; i++) {
      if (PLATFORMS[i].os === os && PLATFORMS[i].arch === arch) return PLATFORMS[i];
    }
    return null;
  }

  /* ---- bin/<platform>/<binary> in the page's repo, as a raw download URL. ---- */
  function binaryUrl(page, platform) {
    var cfg = PAGES[page];
    var name = platform.os === "windows" ? cfg.binary + ".exe" : cfg.binary;
    return (
      "https://raw.githubusercontent.com/" +
      cfg.repo + "/" + cfg.branch + "/bin/" + platform.id + "/" + name
    );
  }

  function applyDownloadButton(page, platform) {
    var btn = byId("act3-download-btn");
    if (!btn) return;
    var label = byId("act3-download-label") || btn;

    if (!platform) {
      // Detection failed: keep the button useful, send them to the full list.
      label.textContent = "Download";
      btn.setAttribute("href", "#act3-os-list");
      btn.removeAttribute("download");
      return;
    }
    label.textContent = "Download for " + platform.label;
    btn.setAttribute("href", binaryUrl(page, platform));
    btn.setAttribute("download", "");
  }

  /* ---- The per-OS list, for downloading for a machine you are not on. ---- */
  function buildOsList(page) {
    var list = byId("act3-os-list");
    if (!list) return;
    list.innerHTML = "";
    for (var i = 0; i < PLATFORMS.length; i++) {
      var p = PLATFORMS[i];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("href", binaryUrl(page, p));
      a.setAttribute("download", "");
      a.textContent = p.label;
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  /* ---- Task #2: copy the git clone command. ---- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand copy failed"));
      } catch (err) {
        reject(err);
      }
    });
  }

  function wireClipboard() {
    var btn = byId("act3-copy-btn");
    var cmd = byId("act3-clone-cmd");
    var tip = byId("act3-copy-tip");
    if (!btn || !cmd) return;

    if (tip) tip.textContent = COPY_IDLE;
    var timer = null;

    btn.addEventListener("click", function () {
      copyText((cmd.textContent || "").trim()).then(
        function () {
          if (!tip) return;
          tip.textContent = COPY_DONE;
          btn.setAttribute("data-copied", "true");
          clearTimeout(timer);
          timer = setTimeout(function () {
            tip.textContent = COPY_IDLE;
            btn.removeAttribute("data-copied");
          }, 2000);
        },
        function () {
          if (tip) tip.textContent = "Press Cmd/Ctrl+C to copy";
        }
      );
    });
  }

  function run(page) {
    buildOsList(page);
    wireClipboard();

    var nav = window.navigator || {};
    if (nav.userAgentData && nav.userAgentData.getHighEntropyValues) {
      nav.userAgentData
        .getHighEntropyValues(["architecture", "platform"])
        .then(function (hints) {
          applyDownloadButton(page, detectPlatform(hints));
        })
        .catch(function () {
          applyDownloadButton(page, detectPlatform(null));
        });
    } else {
      applyDownloadButton(page, detectPlatform(null));
    }
  }

  function init() {
    var page = detectPage();
    if (!page) return; // Fail safe: leave the button exactly as authored.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        run(page);
      });
    } else {
      run(page);
    }
  }

  window.ACT3DownloadPlatform = {
    init: init,
    detectPage: detectPage,
    detectPlatform: detectPlatform,
    binaryUrl: binaryUrl,
    PLATFORMS: PLATFORMS,
    PAGES: PAGES
  };
})();
