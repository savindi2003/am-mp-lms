export type YoutubeLinkRow = {
  id: string;
  title: string;
  description?: string | null;
  link: string;
  visibility: "PUBLISHED" | "HIDDEN";
  createdAt: string;
  month: string;
};
