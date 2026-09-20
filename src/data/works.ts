// Works / Our Stories — type definitions
// Images are loaded dynamically from /public/stories/ via GET /api/works.
// The admin drops .jpg / .jpeg / .png / .webp files there and they appear automatically.

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
