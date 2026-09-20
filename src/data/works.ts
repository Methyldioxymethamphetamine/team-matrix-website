// Works / Our Stories — type definitions
// Images are loaded dynamically from /public/stories/ via GET /api/works.
// Titles/stories come from /public/stories/captions.json (keyed by filename),
// falling back to a filename-derived title when a file has no entry there.
// Managed through /admin, or by editing captions.json + dropping files directly.

export interface WorkItem {
  id: string;
  /** URL path served by Next.js, e.g. /stories/my-photo.jpg */
  img: string;
  /** Reserved for a future external link; clicking a card opens the lightbox, not this */
  url: string;
  title?: string;
  category?: string;
  /**
   * width / height of the source image. Unset from the API — the gallery
   * page preloads each image client-side to measure its natural size, then
   * feeds it into Masonry so every card matches its image's real aspect
   * ratio (no cropping, no letterboxing, works for any image dropped in).
   */
  aspectRatio?: number;
  /** Story copy shown when the image is expanded — blank until written */
  story?: string;
}
