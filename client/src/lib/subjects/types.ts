/**
 * Shared shape for every demo subject.
 *
 * Multiplication questions are generated; reading, science and history
 * questions are authored. Both produce a Challenge so the demo page can render
 * them with one code path.
 *
 * The teaching contract every subject must honour:
 *   - `hint` points at the method and must never contain the answer.
 *   - `explain` gives the reasoning, not just a restatement of the answer.
 *   - `diagnostics` names why a specific wrong choice was tempting, so a
 *     mistake is diagnosed rather than merely marked.
 */

export type Strategy = {
  /** Short name of the thinking move, e.g. "Double it twice", "Main idea". */
  label: string;
  /** Nudge shown before answering. Must not reveal the answer. */
  hint: string;
  /** The reasoning, shown once the question resolves. */
  explain: string;
};

export type Passage = {
  title: string;
  /** Paragraphs, rendered in order. */
  paragraphs: string[];
};

export type Challenge = {
  /** Stable id, used for React keys and tests. */
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  strategy: Strategy;
  /**
   * Choice index -> why that wrong answer is tempting and what it confuses.
   * Not every wrong choice needs one, but the plausible ones should have it.
   */
  diagnostics: Record<number, string>;
  /** Thinking time, in seconds. */
  seconds: number;
  /** Reading comprehension only — shown alongside the question. */
  passage?: Passage;
  /** Multiplication only — drives the dot-array visual. */
  visual?: { rows: number; cols: number };
};

export type SubjectId = "math" | "reading" | "science" | "history";

export type Subject = {
  id: SubjectId;
  name: string;
  icon: string;
  /** One line shown on the subject picker. */
  blurb: string;
  /** What the round teaches, shown under the blurb. */
  skill: string;
  /** Builds a fresh round. Implementations shuffle where appropriate. */
  buildRound: () => Challenge[];
};

/** Fisher-Yates. Returns a new array. */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles a challenge's choices while keeping answerIndex and diagnostics
 * pointing at the right options. Authored banks list the correct answer first
 * for readability, so this stops it always being option A.
 */
export function shuffleChoices(challenge: Challenge): Challenge {
  const order = shuffle(challenge.choices.map((_, i) => i));
  const choices = order.map((i) => challenge.choices[i]);
  const answerIndex = order.indexOf(challenge.answerIndex);

  const diagnostics: Record<number, string> = {};
  order.forEach((originalIndex, newIndex) => {
    const note = challenge.diagnostics[originalIndex];
    if (note) diagnostics[newIndex] = note;
  });

  return { ...challenge, choices, answerIndex, diagnostics };
}
