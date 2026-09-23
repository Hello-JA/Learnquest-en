import { ROUND_LENGTH, diagnose, makeQuestion } from "../mathGame";
import type { Challenge, Subject } from "./types";

/**
 * Adapts the generated multiplication questions to the shared Challenge shape.
 *
 * Multiplication is the one subject that does not need authored content: the
 * facts, their strategies and their distractors are all derived, so a round is
 * different every time.
 */
function toChallenge(index: number): Challenge {
  const q = makeQuestion(index);

  const diagnostics: Record<number, string> = {};
  q.choices.forEach((choice, i) => {
    if (choice === q.product) return;
    const note = diagnose(choice, q.a, q.b);
    if (note) diagnostics[i] = note;
  });

  return {
    id: `math-${index}-${q.a}x${q.b}`,
    prompt: `${q.a} × ${q.b}`,
    choices: q.choices.map(String),
    answerIndex: q.choices.indexOf(q.product),
    strategy: q.strategy,
    diagnostics,
    seconds: q.seconds,
    visual: { rows: q.a, cols: q.b },
  };
}

export const mathSubject: Subject = {
  id: "math",
  name: "Multiplication",
  icon: "✖️",
  blurb: "Build real number sense, not memorised facts.",
  skill: "Mental strategies for times tables",
  buildRound() {
    return Array.from({ length: ROUND_LENGTH }, (_, i) => toChallenge(i));
  },
};
