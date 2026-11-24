import React, { useEffect, useRef, useState } from "react";

/**
 * Loads an HTML file at view time and shows it inside the page (light DOM).
 *
 * Used by site/docs/ownership_of_output/overview.mdx: the page content lives in
 * overview.html, and overview.html pulls in table_ownership.html through a
 * `<div data-include="table_ownership.html">`. Nothing is ever pasted from one
 * file into another, so the page can never hold a stale copy.
 *
 * * src: the file URL (an `import x from "./x.html"`, see docsHtmlAssetPlugin
 *   in docusaurus.config.ts).
 * * includes: name -> URL for `[data-include="name"]` elements (depth <= 3).
 *
 * The content takes its natural height: no iframe, no shadow root, no fixed or
 * max height. Site fonts, theme variables and Ctrl+F all reach it.
 *
 * Tooltips: any element with `data-tip` shows that text in one tooltip that is
 * position:fixed on the page body, so no table or scroll box can clip it. Mouse:
 * on hover. Touch: tap to show, tap elsewhere to hide.
 */

type Props = {
  src: string;
  includes?: Record<string, string>;
};

const MAX_DEPTH = 3;
const DROP_TAGS = "script, iframe, object, embed, frame, frameset, link[rel=import], meta, base";

function sanitize(root: ParentNode): void {
  root.querySelectorAll(DROP_TAGS).forEach((el) => el.remove());
  root.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
      if (name.startsWith("on")) el.removeAttribute(attr.name);
      else if (
        (name === "href" || name === "src" || name === "xlink:href" || name === "action" || name === "formaction") &&
        (value.startsWith("javascript:") || value.startsWith("vbscript:") || value.startsWith("data:text/html"))
      )
        el.removeAttribute(attr.name);
    }
  });
}

/** Parse a full HTML document or a fragment into a DocumentFragment: every <style>, then the body's children. */
async function loadFragment(url: string): Promise<DocumentFragment> {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text, "text/html");
  const frag = document.createDocumentFragment();
  doc.querySelectorAll("style").forEach((style) => frag.appendChild(document.importNode(style, true)));
  Array.from(doc.body.childNodes).forEach((node) => {
    if (node.nodeType === 1 && (node as Element).tagName === "STYLE") return;
    frag.appendChild(document.importNode(node, true));
  });
  sanitize(frag);
  return frag;
}

function errorBox(url: string, err: unknown): HTMLElement {
  console.error("[HtmlInclude] could not load", url, err);
  const box = document.createElement("p");
  box.setAttribute("role", "alert");
  box.style.cssText =
    "padding:12px 14px;border:1px solid var(--ifm-color-danger, #c33);border-radius:6px;color:var(--ifm-font-color-base);";
  box.append("This part of the page could not be loaded. ");
  const a = document.createElement("a");
  a.href = url;
  a.textContent = "Open it directly";
  box.append(a, ".");
  return box;
}

async function fillIncludes(root: ParentNode, includes: Record<string, string>, depth: number): Promise<void> {
  const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-include]"));
  await Promise.all(
    slots.map(async (slot) => {
      const name = slot.getAttribute("data-include") ?? "";
      const url = includes[name];
      if (!url || depth > MAX_DEPTH) {
        slot.replaceChildren(errorBox(url ?? name, new Error(url ? "include depth limit" : `unknown include "${name}"`)));
        return;
      }
      try {
        const frag = await loadFragment(url);
        await fillIncludes(frag, includes, depth + 1);
        slot.replaceChildren(frag);
      } catch (err) {
        slot.replaceChildren(errorBox(url, err));
      }
    }),
  );
}

function useTooltips(host: React.RefObject<HTMLDivElement | null>, ready: boolean): void {
  useEffect(() => {
    const root = host.current;
    if (!ready || !root) return undefined;
    const tip = document.createElement("div");
    tip.setAttribute("role", "tooltip");
    tip.style.cssText = [
      "position:fixed",
      "z-index:1000",
      "max-width:min(440px, calc(100vw - 16px))",
      "padding:8px 10px",
      "border-radius:6px",
      "background:var(--ifm-color-emphasis-900)",
      "color:var(--ifm-color-emphasis-0)",
      "font-size:13px",
      "line-height:1.45",
      "box-shadow:0 6px 24px rgba(0,0,0,.25)",
      "pointer-events:none",
      "white-space:normal",
      "display:none",
    ].join(";");
    document.body.appendChild(tip);
    let current: Element | null = null;

    const place = (x: number, y: number) => {
      const pad = 14;
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let left = x + pad;
      let top = y + pad;
      if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - w - 8);
      if (top + h > window.innerHeight - 8) top = Math.max(8, y - h - pad);
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    };
    const show = (el: Element, x: number, y: number) => {
      current = el;
      tip.textContent = el.getAttribute("data-tip");
      tip.style.display = "block";
      place(x, y);
    };
    const hide = () => {
      current = null;
      tip.style.display = "none";
    };
    const target = (ev: Event) => (ev.target as Element | null)?.closest?.("[data-tip]") ?? null;

    const onOver = (ev: PointerEvent) => {
      if (ev.pointerType === "touch") return;
      const el = target(ev);
      if (el && root.contains(el)) show(el, ev.clientX, ev.clientY);
      else hide();
    };
    const onMove = (ev: PointerEvent) => {
      if (current && ev.pointerType !== "touch") place(ev.clientX, ev.clientY);
    };
    const onLeave = () => hide();
    const onClick = (ev: MouseEvent) => {
      const el = target(ev);
      if (el && root.contains(el)) {
        if (current === el) hide();
        else show(el, ev.clientX, ev.clientY);
      } else hide();
    };
    const onScroll = () => {
      if (current) hide();
    };

    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      tip.remove();
    };
  }, [host, ready]);
}

export default function HtmlInclude({ src, includes = {} }: Props): React.ReactElement {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const el = host.current;
      if (!el) return;
      try {
        const frag = await loadFragment(src);
        await fillIncludes(frag, includes, 1);
        if (cancelled) return;
        el.replaceChildren(frag);
        setState("ready");
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (id) {
          const target = document.getElementById(id);
          if (target && el.contains(target)) requestAnimationFrame(() => target.scrollIntoView());
        }
      } catch (err) {
        if (cancelled) return;
        el.replaceChildren(errorBox(src, err));
        setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // includes is a literal in the .mdx; its URLs only change with src.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useTooltips(host, state === "ready");

  return (
    <>
      {state === "loading" && <p>Loading…</p>}
      <div ref={host} />
    </>
  );
}
