/**
 * V4Header — the top bar of the v4 site template (the default for every page).
 *
 * A copy of the homepage hero's top bar (row 1, .r1v42-top): yellow "3" mark +
 * "ACT 3" in Barlow Condensed, the centre nav in Barlow 15/500, "Sign in" and the
 * square yellow GET STARTED › button on the right, 84px tall (64px at <=760px),
 * collapsing to a MENU button with a dark pop panel at <=1080px. Because it is
 * not laid over video it sits on the hero's ground colour and is sticky.
 *
 *   <V4Header inLayout />   from src/theme/Navbar, on every Docusaurus <Layout> page except /backup/*
 *   <V4Header />            from V4RowsPage, when none of its rows brings its own top bar
 *
 * `inLayout` adds the docs/blog sidebar drawer for phones and tablets
 * (V4DocsDrawer.tsx); it needs Docusaurus's navbar context, which only exists
 * inside <Layout>. Links come from site/data/siteNav.ts; styles are in
 * site/css/v4-template.css (every class here starts with "v4t-").
 *
 * Crawlability (CLAUDE.md "SEO invariants"): the More dropdown and the mobile
 * menu are ALWAYS in the served HTML and only hidden with CSS, so crawlers that
 * do not run JavaScript still see /mcp, /cli, /articles and every other link.
 *
 * The More dropdown is a disclosure (not an ARIA menu): it shows on hover, while
 * keyboard focus is inside its panel (its links stay focusable when hidden, so
 * Tab and Shift+Tab both walk into it), and by the button's click toggle.
 * aria-expanded always reports what is on screen. Escape closes it and returns
 * focus to the button.
 */
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "@docusaurus/router";
import V4Link from "./V4Link";
import { V4DocsDrawer, V4DocsMenuItem, hasDrawerSidebar } from "./V4DocsDrawer";
import { MORE_NAV, PRIMARY_NAV, SIGNIN, SIGNUP, currentAttr, type NavItem } from "../../data/siteNav";

/** "true" = opened by click, "false" = closed by click (beats hover until the pointer leaves), null = hover/focus decide. */
type MoreState = "true" | "false" | null;

function NavItemLink({ item, pathname, className }: { item: NavItem; pathname: string; className: string }): React.JSX.Element {
  return (
    <V4Link
      href={item.href}
      newTab={item.newTab}
      pending={item.pending}
      className={className}
      aria-current={currentAttr(item.href, pathname)}
    >
      {item.label}
    </V4Link>
  );
}

export interface V4HeaderProps {
  /** Rendered as the Docusaurus <Layout> navbar (src/theme/Navbar): enables the docs/blog drawer. */
  inLayout?: boolean;
}

export default function V4Header({ inLayout = false }: V4HeaderProps): React.JSX.Element {
  const { pathname } = useLocation();
  const [more, setMoreState] = useState<MoreState>(null);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false); // keyboard focus inside the panel
  // Mirror of `more` for handlers that run before the next render.
  const moreNow = useRef<MoreState>(null);
  const setMore = (v: MoreState): void => {
    moreNow.current = v;
    setMoreState(v);
  };
  const moreRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const moreActive = MORE_NAV.some((i) => currentAttr(i.href, pathname));
  const expanded = more === "true" || (more !== "false" && (hover || focusIn));
  const drawer = inLayout && hasDrawerSidebar(pathname);

  // A navigation closes both menus.
  useEffect(() => {
    setMore(null);
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  // Escape closes either menu (focus goes back to its button); a click outside closes either menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      const wrap = moreRef.current;
      if (wrap && (wrap.contains(document.activeElement) || moreNow.current === "true" || wrap.matches(":hover"))) {
        const hadFocus = wrap.contains(document.activeElement);
        setMore("false");
        setFocusIn(false);
        if (hadFocus) btnRef.current?.focus();
      }
      const menu = menuRef.current;
      if (menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    const onDown = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (moreNow.current === "true" && moreRef.current && !moreRef.current.contains(t)) setMore(null);
      if (menuRef.current?.open && !menuRef.current.contains(t)) menuRef.current.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  const toggleMore = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Keyboard (detail 0): toggle what is on screen. Mouse or touch: toggle the
    // click "pin" only, so a click on a hover-opened panel keeps it open (and a
    // touch tap's emulated hover cannot close it); a second click closes it.
    const shown = e.detail === 0 ? expanded : more === "true";
    setMore(shown ? "false" : "true");
  };

  return (
    <>
      <header className="v4t-top">
        <V4Link className="v4t-logo" href="/" aria-label="ACT 3 AI home">
          <span className="v4t-logo-mark" aria-hidden="true">3</span>
          <span>ACT&nbsp;3</span>
        </V4Link>

        <nav className="v4t-nav" aria-label="Main">
          {PRIMARY_NAV.map((item) => (
            <NavItemLink key={item.label} item={item} pathname={pathname} className="v4t-nav-link" />
          ))}
          <div
            className="v4t-more"
            ref={moreRef}
            data-open={more ?? undefined}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
              setHover(false);
              if (moreNow.current === "false") setMore(null);
            }}
            onBlur={(e) => {
              // Focus left the whole dropdown: a click-opened panel closes with it.
              const wrap = e.currentTarget;
              if (wrap.contains(e.relatedTarget as Node | null)) return;
              if (moreNow.current === "true" || (moreNow.current === "false" && !wrap.matches(":hover"))) setMore(null);
            }}
          >
            <button
              type="button"
              ref={btnRef}
              className="v4t-nav-link v4t-more-btn"
              aria-expanded={expanded}
              aria-controls="v4t-more-pop"
              data-active={moreActive || undefined}
              onClick={toggleMore}
            >
              More <span className="v4t-chev" aria-hidden="true">⌄</span>
            </button>
            <div
              className="v4t-more-pop"
              id="v4t-more-pop"
              onFocus={() => {
                setFocusIn(true);
                // Tabbing back in after a close: focus shows the panel again.
                if (moreNow.current === "false") setMore(null);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false);
              }}
            >
              {MORE_NAV.map((item) => (
                <NavItemLink key={item.label} item={item} pathname={pathname} className="v4t-more-item" />
              ))}
            </div>
          </div>
        </nav>

        <div className="v4t-actions">
          <a className="v4t-signin" href={SIGNIN}>Sign in</a>
          <a className="v4t-cta v4t-cta-sm" href={SIGNUP}>
            Get Started <span aria-hidden="true">›</span>
          </a>
          <details
            className="v4t-menu"
            ref={menuRef}
            onBlur={(e) => {
              // Focus left the menu (Tab past its last entry): close the panel so it
              // never covers the newly focused control.
              // (Safari does not focus a clicked link, so a null relatedTarget while the
              // pointer is over the panel is a click inside it: keep it open for that click.)
              const d = e.currentTarget;
              const to = e.relatedTarget as Node | null;
              if (to ? !d.contains(to) : !d.matches(":hover")) d.open = false;
            }}
          >
            <summary>Menu</summary>
            <nav className="v4t-menu-pop" aria-label="Menu">
              {drawer ? (
                <V4DocsMenuItem
                  pathname={pathname}
                  onOpen={() => {
                    if (menuRef.current) menuRef.current.open = false;
                  }}
                />
              ) : null}
              {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                <NavItemLink key={item.label} item={item} pathname={pathname} className="v4t-menu-item" />
              ))}
              <a className="v4t-menu-item v4t-menu-sign" href={SIGNIN}>Sign in</a>
            </nav>
          </details>
        </div>
      </header>
      {drawer ? <V4DocsDrawer /> : null}
    </>
  );
}
