/**
 * Game logic for the multiplication demo.
 *
 * Kept free of React so the teaching content can be unit tested — a wrong
 * explanation shown to a child (or a prospective customer) is worse than no
 * explanation at all.
 */

export type Strategy = {
  /** Short name of the mental strategy, e.g. "Double it twice". */
  label: string;
  /** Nudge shown before answering — must never contain the answer. */
  hint: string;
  /** Full reasoning, shown after answering. */
  explain: string;
};

export type Question = {
  a: number;
  b: number;
  product: number;
  choices: number[];
  strategy: Strategy;
  /** Thinking time allowed for this fact, in seconds. */
  seconds: number;
};

export type MissedFact = { a: number; b: number; strategy: Strategy };

export type Phase = "intro" | "playing" | "done";

export const ROUND_LENGTH = 10;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Extra time granted when a child opens a hint. Reading the hint and then
 * applying it takes longer than recalling a fact, and we never want the clock
 * to make asking for help feel like a penalty.
 */
export const HINT_BONUS_SECONDS = 10;

/**
 * Thinking time for a fact, scaled to how much work it actually takes.
 *
 * These are deliberately generous. The tiers mirror the strategy tiers below:
 * a one-step trick, a slightly longer single step, and the 6/7/8 facts that
 * need decomposing into two steps. Time still has to cover reading the
 * question and four options before any thinking starts.
 */
export function secondsFor(a: number, b: number): number {
  const [small, large] = a <= b ? [a, b] : [b, a];

  // One-step tricks: identity, doubling, half-of-ten, place value.
  if (small === 1 || small === 2 || small === 5 || large === 10) return 12;

  // Single step, but more to hold in mind: triples, double-twice, ten-minus-one.
  if (small === 3 || small === 4 || large === 9) return 16;

  // 6, 7 and 8 against each other — needs breaking into two easier facts.
  return 20;
}

/**
 * Picks the most useful mental strategy for a fact. Order matters: the
 * easiest lever (×1, ×2, ×10…) wins before falling back to decomposition.
 */
export function buildStrategy(a: number, b: number): Strategy {
  const p = a * b;
  const [small, large] = a <= b ? [a, b] : [b, a];

  if (small === 1) {
    return {
      label: "Multiplying by 1",
      hint: "How many groups do you have? Only one.",
      explain: `One group of ${large} is just ${large}. Multiplying by 1 never changes a number, so ${a} × ${b} = ${p}.`,
    };
  }

  if (small === 2) {
    return {
      label: "Doubling",
      hint: `Two groups of ${large} — that is ${large} + ${large}.`,
      explain: `Two groups means adding the number to itself: ${large} + ${large} = ${p}. Multiplying by 2 is always just doubling.`,
    };
  }

  if (large === 10) {
    return {
      label: "Place value",
      hint: "Multiplying by 10 pushes every digit one place to the left.",
      explain: `${small} × 10 = ${p}. Every digit shifts one place left and a 0 fills the ones place — that is why the answer is ${small} with a 0 after it.`,
    };
  }

  if (small === 5) {
    return {
      label: "Half of ten",
      hint: `5 is half of 10. What is ${large} × 10? Now take half of it.`,
      explain: `${large} × 10 = ${large * 10}. Because 5 is half of 10, halve that answer: ${large * 10} ÷ 2 = ${p}.`,
    };
  }

  if (large === 9) {
    return {
      label: "Ten groups, minus one",
      hint: `9 is one less than 10. Start at ${small} × 10, then take one group away.`,
      explain: `${small} × 10 = ${small * 10}, but that is one group of ${small} too many. Take it away: ${small * 10} − ${small} = ${p}.`,
    };
  }

  if (small === 4) {
    return {
      label: "Double it twice",
      hint: `4 is 2 × 2, so double ${large} — then double your answer again.`,
      explain: `Double ${large} to get ${large * 2}. Double that again: ${large * 2} + ${large * 2} = ${p}. That is why multiplying by 4 is "double it twice".`,
    };
  }

  if (small === 3) {
    return {
      label: "Equal groups",
      hint: `Three groups of ${large}. Try ${large} + ${large} + ${large}.`,
      explain: `Three equal groups stacked up: ${large} + ${large} + ${large} = ${p}.`,
    };
  }

  // The genuinely hard facts (6, 7, 8 against each other): split the larger
  // factor into 5 + the rest, because the ×5 fact is already automatic.
  const rest = large - 5;
  return {
    label: "Break it apart",
    hint: `Split ${large} into 5 + ${rest}. You already know ${small} × 5.`,
    explain: `${small} × 5 = ${small * 5}, and ${small} × ${rest} = ${small * rest}. Add the two pieces back together: ${small * 5} + ${small * rest} = ${p}. Breaking one hard fact into two easy ones always works.`,
  };
}

/**
 * Names the specific misconception behind a wrong choice, so feedback reads
 * as "here is what happened" rather than a bare "incorrect".
 */
export function diagnose(chosen: number, a: number, b: number): string | null {
  const p = a * b;
  if (chosen === p) return null;
  if (chosen === a + b)
    return `That is ${a} + ${b}. Adding joins two numbers, but ${a} × ${b} means ${a} whole groups of ${b}.`;
  if (chosen === p - b)
    return `That is ${a - 1} groups of ${b} — you stopped one group early.`;
  if (chosen === p + b)
    return `That is ${a + 1} groups of ${b} — one group too many.`;
  if (chosen === p - a)
    return `Every group was one too small — that answer is ${a} × ${b - 1}.`;
  if (chosen === p + a)
    return `Every group was one too big — that answer is ${a} × ${b + 1}.`;
  return null;
}

/**
 * Builds one question. Distractors are deliberately the answers a child would
 * reach by a specific reasoning error, so `diagnose` has something to explain.
 */
export function makeQuestion(index: number): Question {
  let a: number;
  let b: number;

  // Ramp difficulty across the round: friendly tables first, then the facts
  // children most often memorise incorrectly.
  if (index < 3) {
    a = pick([2, 5, 10]);
    b = randInt(2, 9);
  } else if (index < 7) {
    a = pick([3, 4, 9]);
    b = randInt(2, 9);
  } else {
    a = pick([6, 7, 8]);
    b = randInt(4, 9);
  }

  const p = a * b;

  // Distractors that correspond to a nameable reasoning error, so diagnose()
  // has something to explain.
  const meaningful = shuffle(
    Array.from(
      new Set([p - b, p + b, p - a, p + a, a + b, (a + 1) * b, a * (b + 1)])
    ).filter((n) => n !== p && n > 0)
  );

  // Square facts (3 × 3, 7 × 7 …) collapse the list above into duplicates,
  // so top up with plain near-misses to always reach four choices.
  const filler = shuffle(
    Array.from(new Set([p - 1, p + 1, p - 2, p + 2, p + 10, p * 2])).filter(
      (n) => n !== p && n > 0 && !meaningful.includes(n)
    )
  );

  const wrong = [...meaningful, ...filler];

  return {
    a,
    b,
    product: p,
    choices: shuffle([p, ...wrong.slice(0, 3)]),
    strategy: buildStrategy(a, b),
    seconds: secondsFor(a, b),
  };
}
