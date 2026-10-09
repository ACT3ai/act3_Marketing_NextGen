/**
 * rowHarness — runs homepage-row engines (site/static/v4/row_N/v/row.js) safely
 * inside a React page. Moved out of site/pages/index.tsx unchanged so every page
 * built from homepage rows (V4RowsPage) shares one copy.
 *
 *   const rootRef = useRef<HTMLDivElement>(null);
 *   useRowEngines(rootRef, rows);   // rows: V4Row[] rendered as [data-row="N"] inside rootRef
 *
 * Why it exists (see the generator header in scripts/build-v4-rows.js):
 *  * Plain <script> inside dangerouslySetInnerHTML never runs, so each row's
 *    engine files are loaded in a useEffect, sequentially in the recorded order,
 *    as fresh <script> elements on every mount.
 *  * Each script element carries a lifecycle context (__v4ctx) that the
 *    generator's wrapper hands to the engine as its window/document/rAF/timers/
 *    observers. On unmount the page stops every loop, timer, observer and
 *    document/window listener the engine started; the engines have no teardown
 *    of their own, so without this SPA navigation would leave them running on
 *    detached DOM and stack a second copy on return.
 *  * ?theme=light | ?theme=dark (review aid only) switches every row together.
 */
import { useEffect, type RefObject } from "react";
import type { V4Row } from "../../pages/_rows.generated";

// ── lifecycle harness for the row engines ────────────────────────────────────
// Each loaded script reads document.currentScript.__v4ctx and uses it in place of
// the real globals. stop() cancels everything the engine started; once stopped,
// a late-arriving script finds no DOM and allocates nothing.

type AnyFn = (...args: any[]) => any;
type Listener = [EventTarget, string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
type ScriptWithCtx = HTMLScriptElement & { __v4ctx?: Record<string, unknown> };

export function makeRowContext(): { ctx: Record<string, unknown>; stop: () => void } {
  let alive = true;
  const rafs = new Set<number>();
  const timeouts = new Set<number>();
  const intervals = new Set<number>();
  const observers: { disconnect(): void }[] = [];
  const listeners: Listener[] = [];

  const requestAnimationFrame = (cb: FrameRequestCallback): number => {
    if (!alive) return 0;
    const id = window.requestAnimationFrame((t) => {
      rafs.delete(id);
      if (alive) cb(t);
    });
    rafs.add(id);
    return id;
  };
  const cancelAnimationFrame = (id: number): void => {
    rafs.delete(id);
    window.cancelAnimationFrame(id);
  };
  const setTimeout = (cb: TimerHandler, ms?: number, ...args: unknown[]): number => {
    if (!alive || typeof cb !== "function") return 0;
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      if (alive) (cb as AnyFn)(...args);
    }, ms);
    timeouts.add(id);
    return id;
  };
  const clearTimeout = (id?: number): void => {
    if (id === undefined) return;
    timeouts.delete(id);
    window.clearTimeout(id);
  };
  const setInterval = (cb: TimerHandler, ms?: number, ...args: unknown[]): number => {
    if (!alive || typeof cb !== "function") return 0;
    const id = window.setInterval(() => {
      if (alive) (cb as AnyFn)(...args);
    }, ms);
    intervals.add(id);
    return id;
  };
  const clearInterval = (id?: number): void => {
    if (id === undefined) return;
    intervals.delete(id);
    window.clearInterval(id);
  };

  type ObserverCtor = new (cb: AnyFn, options?: unknown) => { observe(...a: unknown[]): void; disconnect(): void };
  const track = (Base: unknown): unknown => {
    if (typeof Base !== "function") return Base;
    const B = Base as ObserverCtor;
    return class extends B {
      constructor(cb: AnyFn, options?: unknown) {
        super((...a: unknown[]) => {
          if (alive) cb(...a);
        }, options);
        observers.push(this);
      }
      observe(...a: unknown[]): void {
        if (alive) super.observe(...a);
      }
    };
  };

  const addFor = (target: EventTarget) => (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions): void => {
    if (!alive || !fn) return;
    listeners.push([target, type, fn, opts]);
    target.addEventListener(type, fn, opts);
  };
  const removeFor = (target: EventTarget) => (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | EventListenerOptions): void => {
    target.removeEventListener(type, fn, opts);
  };

  // Forwarding proxy: overrides win, functions are bound to the real object
  // (lower-case names only, so constructors keep their statics), writes go through.
  const forward = <T extends object>(target: T, extra: Record<string | symbol, unknown>, lookups: boolean): T =>
    new Proxy(target, {
      get(t, p) {
        if (p in extra) return extra[p];
        if (lookups && !alive && typeof p === "string" && /^(querySelector|getElementBy|getElementsBy)/.test(p)) {
          return () => (/All$|^getElements/.test(p) ? [] : null);
        }
        const v = (t as Record<string | symbol, unknown>)[p];
        if (typeof v === "function" && typeof p === "string" && /^[a-z]/.test(p)) return (v as AnyFn).bind(t);
        return v;
      },
      set(t, p, v) {
        (t as Record<string | symbol, unknown>)[p] = v;
        return true;
      },
      has(t, p) {
        return p in extra || p in t;
      },
      deleteProperty(t, p) {
        return delete (t as Record<string | symbol, unknown>)[p];
      },
    });

  const doc = forward(document, { addEventListener: addFor(document), removeEventListener: removeFor(document) }, true);
  const winExtra: Record<string, unknown> = {
    document: doc,
    requestAnimationFrame,
    cancelAnimationFrame,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    IntersectionObserver: track(window.IntersectionObserver),
    ResizeObserver: track(window.ResizeObserver),
    MutationObserver: track(window.MutationObserver),
    addEventListener: addFor(window),
    removeEventListener: removeFor(window),
  };
  const win = forward(window, winExtra, false);
  winExtra.window = win;
  winExtra.self = win;

  const ctx: Record<string, unknown> = { ...winExtra, window: win };
  const stop = (): void => {
    alive = false;
    rafs.forEach((id) => window.cancelAnimationFrame(id));
    timeouts.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect());
    listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
    rafs.clear();
    timeouts.clear();
    intervals.clear();
    observers.length = 0;
    listeners.length = 0;
  };
  return { ctx, stop };
}

export function loadScript(src: string, ctx: Record<string, unknown>, added: HTMLScriptElement[]): Promise<boolean> {
  return new Promise((resolve) => {
    const s = document.createElement("script") as ScriptWithCtx;
    s.src = src;
    s.async = false;
    s.__v4ctx = ctx;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    added.push(s);
    document.body.appendChild(s);
  });
}

/**
 * Loads and runs the engines of `rows` (rendered as [data-row="N"] inside
 * rootRef), and stops all of them on unmount. `rows` must be stable across
 * renders (a module constant or a useMemo), or the engines restart.
 */
export function useRowEngines(rootRef: RefObject<HTMLElement | null>, rows: readonly V4Row[]): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const w = window as unknown as Record<string, unknown>;

    // Review aid only: ?theme=light | ?theme=dark switches every row together.
    const theme = new URLSearchParams(window.location.search).get("theme");
    if (theme === "light" || theme === "dark") root.setAttribute("data-v4-theme", theme);

    let cancelled = false;
    const added: HTMLScriptElement[] = [];
    const stops: (() => void)[] = [];
    const jobs = rows.map((r) => {
      const el = root.querySelector<HTMLElement>(`[data-row="${r.row}"]`);
      // An effect that runs again on the same DOM (React StrictMode in dev)
      // starts from fresh markup, so engines that append nodes cannot double.
      if (el && el.dataset.v4Ran) el.innerHTML = r.html;
      for (const g of r.windowGlobals) delete w[g];
      const { ctx, stop } = makeRowContext();
      stops.push(stop);
      return { r, el, ctx };
    });

    (async () => {
      for (const { r, el, ctx } of jobs) {
        if (!el || r.scripts.length === 0) continue;
        el.dataset.v4Ran = "1";
        for (const src of r.scripts) {
          if (cancelled) return;
          const ok = await loadScript(src, ctx, added);
          if (!ok) {
            console.warn(`[v4] row ${r.row}: failed to load ${src}; skipping the rest of this row's scripts`);
            break;
          }
        }
      }
    })();

    return () => {
      cancelled = true;
      stops.forEach((stop) => stop());
      added.forEach((s) => s.remove());
      root.querySelectorAll("video").forEach((v) => v.pause());
      for (const r of rows) for (const g of r.windowGlobals) delete w[g];
    };
  }, [rootRef, rows]);
}
