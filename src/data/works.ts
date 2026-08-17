// Works / Our Stories — type definitions
// Images are loaded dynamically from /public/stories/ via GET /api/works.
// The admin drops .jpg / .jpeg / .png / .webp files there and they appear automatically.

export interface WorkItem {
  id: string;
  /** URL path served by Next.js, e.g. /stories/my-photo.jpg */
  img: string;
  /** Link when the card is clicked */
  url: string;
  /** Card height in pixels used by the Masonry layout */
  height: number;
  title?: string;
  category?: string;
}
