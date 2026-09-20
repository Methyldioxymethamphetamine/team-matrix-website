// Members — type definitions.
// Data lives in src/data/members.json (loaded at runtime via GET /api/members),
// managed through /admin, or by editing that file directly and dropping photos
// into /public/members/.

export type Department =
  | "Leadership"
  | "Mechanical"
  | "Electronics"
  | "Algorithms"
  | "Management";

export interface Member {
  id: string;
  /** Full display name */
  name: string;
  /** Role / department */
  title: string;
  /** @handle shown on card (no @ prefix needed) */
  handle: string;
  /** Status shown on card, e.g. "Active", "Team Lead" */
  status: string;
  /** Path to avatar image in /public/members/ */
  avatarUrl: string;
  /** Primary department, used for filtering on the /members page */
  department: Department;
  /** Marks heads/co-heads/captain/manager for the "Leadership" filter + badge */
  lead?: boolean;
}

