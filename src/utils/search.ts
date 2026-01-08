export const escapeRegex = (input: string): string =>
  input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MEMBER_SEARCH_FIELDS = ["firstName", "middleName", "lastName", "email", "universityId"];

export const buildMemberSearchOr = (search: unknown): Array<Record<string, RegExp>> | null => {
  if (typeof search !== "string") return null;
  const term = search.trim();
  if (!term) return null;

  const safeRegex = new RegExp(escapeRegex(term), "i");
  return MEMBER_SEARCH_FIELDS.map((field) => ({ [field]: safeRegex }));
};
