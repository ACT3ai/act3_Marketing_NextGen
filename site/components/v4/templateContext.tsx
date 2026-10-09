/**
 * templateContext — lets a page that ships its OWN design overlay keep it.
 *
 * Every non-/backup <Layout> page gets <html class="v4t v4t-skin"> from
 * src/theme/Layout: "v4t" = the template chrome (header, footer, geometry) and
 * "v4t-skin" = the dark Infima skin (page ground, text, links, docs, blog...).
 * A page that already has its own complete design overlay (today: the cream
 * Assistant Director Team pages, wrapperClassName "level2-page", and the
 * articles, "article-page") wraps its <Layout> in <V4OwnDesign> so it keeps
 * the template header and footer but not the dark skin, which would otherwise
 * fight its overlay. src/theme/MDXPage does this for any page with a
 * wrapperClassName in its front matter.
 *
 *   <V4OwnDesign><Layout>...</Layout></V4OwnDesign>
 */
import React, { createContext, useContext } from "react";

const SkinContext = createContext<boolean>(true);

/** Renders its children without the v4 dark skin (template header/footer stay). */
export function V4OwnDesign({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <SkinContext.Provider value={false}>{children}</SkinContext.Provider>;
}

/** False inside <V4OwnDesign>. Read by src/theme/Layout. */
export function useV4Skin(): boolean {
  return useContext(SkinContext);
}
