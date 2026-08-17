// Members data — Team Matrix
// Update this file to add/remove/edit members.
// Place member photos in /public/members/ — reference them as "/members/filename.webp"

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
}

export const members: Member[] = [
  // ── ROW 1 ─────────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Jithin Puthur",
    title: "Captain",
    handle: "placeholder",
    status: "Captain",
    avatarUrl: "/members/ajssitd2lsjpo0hjgq2k.webp",
  },
  {
    id: "2",
    name: "Ms. Devyani Amrutkar",
    title: "Algorithms Head",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/buqdgpefqmsfo1ylokl5.webp",
  },
  {
    id: "3",
    name: "Pranav Bachhav",
    title: "Manager",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/p82nscxorkudfe7qdl4f.webp",
  },
  {
    id: "4",
    name: "Tanmay Gajkal",
    title: "Electronics Head",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/vetiznrnvi0n3citbk8d.webp",
  },
  // ── ROW 2 ─────────────────────────────────────────────────────────────────
  {
    id: "5",
    name: "Neha Tiwari",
    title: "Co-Head Algorithms",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/wagx8rync4eauw4bek9u.webp",
  },
  {
    id: "6",
    name: "Raman Walsetwar",
    title: "Co-Head Mechanical",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/mpcr0dczx8ispdqzra4i.webp",
  },
  {
    id: "7",
    name: "Vinayak Bashetti",
    title: "Management",
    handle: "placeholder",
    status: "Active",
    avatarUrl: "/members/itkuvp9edknes9zalyzo.webp",
  },
  {
    id: "8",
    name: "Rishikesh Shirsath",
    title: "Mechanical Head",
    handle: "cadspec",
    status: "Active",
    avatarUrl: "/members/hfcmhjlpo17qk9c16nmy.webp",
  },
];
