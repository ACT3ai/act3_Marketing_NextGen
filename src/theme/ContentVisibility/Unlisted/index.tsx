/**
 * Swizzled override of @theme/ContentVisibility/Unlisted.
 *
 * Unlisted marketing pages (e.g. /marketing_981769) must stay out of search
 * engines and the sitemap, but customers who open the direct link must NOT see
 * the default "This page is unlisted…" banner.
 *
 * We keep the noindex/nofollow robots meta (identical to Docusaurus's built-in
 * UnlistedMetadata) and deliberately drop the visible banner. Sitemap exclusion
 * is driven by the `unlisted: true` front matter at the plugin level and is
 * unaffected by this component. We inline the <Head> meta here (rather than
 * importing UnlistedMetadata from @docusaurus/theme-common, which isn't a direct
 * dependency and doesn't resolve from src/).
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import type {Props} from '@theme/ContentVisibility/Unlisted';

export default function Unlisted(_props: Props): ReactNode {
  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
}
