import { mathSubject } from "./math";
import { readingSubject } from "./reading";
import type { Subject, SubjectId } from "./types";

export * from "./types";

/** Order shown on the subject picker. */
export const SUBJECTS: Subject[] = [mathSubject, readingSubject];

export function getSubject(id: SubjectId): Subject {
  const found = SUBJECTS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown subject: ${id}`);
  return found;
}
