import { historySubject } from "./history";
import { mathSubject } from "./math";
import { readingSubject } from "./reading";
import { scienceSubject } from "./science";
import type { Subject, SubjectId } from "./types";

export * from "./types";

/** Order shown on the subject picker. */
export const SUBJECTS: Subject[] = [
  mathSubject,
  readingSubject,
  scienceSubject,
  historySubject,
];

export function getSubject(id: SubjectId): Subject {
  const found = SUBJECTS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown subject: ${id}`);
  return found;
}
