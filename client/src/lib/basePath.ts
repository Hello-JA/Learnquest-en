/**
 * Where the app is served from.
 *
 * Vite sets BASE_URL from the build `base` option: "/" for local dev and
 * Vercel, "/<repo>/" for the GitHub Pages preview. Anything that builds a URL
 * by hand — plain anchors, window.location assignments — has to account for it
 * or those links break on Pages.
 */

/** Trailing slash included, e.g. "/" or "/Learnquest-en/". */
export const basePath = import.meta.env.BASE_URL;

/** No trailing slash, e.g. "" or "/Learnquest-en". For wouter's Router base. */
export const routerBase = basePath.replace(/\/$/, "");

/** Builds a link to a section on the home page, e.g. "/Learnquest-en/#faq". */
export const homeAnchor = (id: string) => `${basePath}#${id}`;

/**
 * True when the app was built as a static preview with no backend, so the
 * waitlist form can explain itself instead of failing with a network error.
 */
export const isStaticPreview =
  import.meta.env.VITE_STATIC_PREVIEW === "true";
