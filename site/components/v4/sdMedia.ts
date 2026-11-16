/**
 * Phones get smaller copies of the rows' oversized media (scripts/build-v4-sd.js).
 *
 * The originals (4K hero clips, 5504 px screenshots) used so much memory that
 * mobile browsers killed the homepage tab: a white page, then a reload by
 * itself, every visit. Desktop keeps the originals.
 */
import { SD_MEDIA } from "./sdMedia.generated";

/** Below this width, or on a touch-only device, a screen counts as a phone. */
export const PHONE_MEDIA = "(max-width: 1024px), (hover: none) and (pointer: coarse)";

export function isPhone(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(PHONE_MEDIA).matches;
}

/** The phone copy of `url` (a /v4/... path, or this site's absolute URL to one), else `url` unchanged. */
export function sdUrl(url: string): string {
  if (typeof url !== "string") return url;
  const path = url.replace(/^https?:\/\/[^/]+/, "");
  return SD_MEDIA[path]?.sd ?? url;
}

/** Makes `el.src` / `el.poster` assignments on an <img> or <video> use the phone copies. */
export function useSdOn(el: Element): void {
  for (const prop of ["src", "poster"]) {
    let proto: object | null = Object.getPrototypeOf(el);
    let desc: PropertyDescriptor | undefined;
    while (proto && !(desc = Object.getOwnPropertyDescriptor(proto, prop))) proto = Object.getPrototypeOf(proto);
    if (!desc?.set || !desc.get) continue;
    const { get, set } = desc;
    Object.defineProperty(el, prop, {
      configurable: true,
      enumerable: true,
      get() {
        return get.call(el);
      },
      set(v: string) {
        set.call(el, sdUrl(v));
      },
    });
  }
}

/**
 * Markup: every <img> whose src has a phone copy and no srcset of its own gets
 * one. `sizes` makes phones (≤ 1024 px wide) take the copy at any pixel density,
 * and every wider screen the original, as before.
 */
export function addSdSrcset(html: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\ssrcset=/.test(tag)) return tag;
    const m = /\ssrc="([^"]+)"/.exec(tag);
    const sd = m && SD_MEDIA[m[1]];
    if (!sd) return tag;
    const srcset = `${sd.sd} ${sd.w}w, ${m[1]} ${sd.fullW}w`;
    const sizes = `(max-width: 1024px) ${Math.floor(sd.w / 3)}px, ${sd.fullW}px`;
    return tag.replace(/^<img\b/, `<img srcset="${srcset}" sizes="${sizes}"`);
  });
}
