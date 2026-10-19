/**
 * The canonical production origin of the site.
 *
 * Hardcoded on purpose: Vercel hands out a different *.vercel.app URL for
 * every push, and relying on a SITE_URL env var once meant the live
 * robots.txt and sitemap.xml advertised http://localhost:3000 to search
 * engines. One literal in the codebase is the only URL that is always
 * correct — no environment can drift it.
 */
export const SITE_URL = "https://zacleaning.com";

/** Absolute URL for a path: siteUrl("/quote") → "https://zacleaning.com/quote" */
export function siteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
