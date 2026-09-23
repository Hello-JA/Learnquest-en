import { describe, expect, it } from "vitest";
import { SUBJECTS, getSubject, shuffleChoices, type Challenge } from "./index";
import { READING_SETS } from "./reading";
import { HISTORY_QUESTIONS } from "./history";

/** Every authored challenge, before shuffling. */
const AUTHORED: Omit<Challenge, "seconds">[] = [
  ...READING_SETS.flatMap((s) => s.questions),
  ...HISTORY_QUESTIONS,
];

describe("authored content", () => {
  it("has a unique id for every question", () => {
    const ids = AUTHORED.map((q) => q.id);
    expect(new Set(ids).size, `duplicate ids in: ${ids}`).toBe(ids.length);
  });

  it("gives every question four distinct choices", () => {
    for (const q of AUTHORED) {
      expect(q.choices, q.id).toHaveLength(4);
      expect(new Set(q.choices).size, `${q.id} repeats a choice`).toBe(4);
      for (const c of q.choices) {
        expect(c.trim().length, `${q.id} has an empty choice`).toBeGreaterThan(0);
      }
    }
  });

  it("points answerIndex at a real choice", () => {
    for (const q of AUTHORED) {
      expect(q.answerIndex, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex, q.id).toBeLessThan(q.choices.length);
    }
  });

  it("never writes a diagnostic for the correct answer", () => {
    // A diagnostic explains why a choice is wrong, so one attached to the
    // right answer means the indices have drifted.
    for (const q of AUTHORED) {
      expect(
        q.diagnostics[q.answerIndex],
        `${q.id} has a diagnostic on its correct answer`
      ).toBeUndefined();
    }
  });

  it("only writes diagnostics for choices that exist", () => {
    for (const q of AUTHORED) {
      for (const key of Object.keys(q.diagnostics)) {
        const i = Number(key);
        expect(Number.isInteger(i), `${q.id} has a non-numeric diagnostic key`).toBe(
          true
        );
        expect(i, `${q.id} diagnoses a choice that does not exist`).toBeLessThan(
          q.choices.length
        );
      }
    }
  });

  it("diagnoses at least two wrong choices per question", () => {
    // The point of the demo is that mistakes get named, so most distractors
    // need an explanation rather than silence.
    for (const q of AUTHORED) {
      expect(
        Object.keys(q.diagnostics).length,
        `${q.id} barely diagnoses anything`
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("writes a hint, an explanation and a strategy label for every question", () => {
    for (const q of AUTHORED) {
      expect(q.strategy.label.trim().length, `${q.id} label`).toBeGreaterThan(0);
      expect(q.strategy.hint.trim().length, `${q.id} hint`).toBeGreaterThan(10);
      expect(
        q.strategy.explain.trim().length,
        `${q.id} explanation is too thin`
      ).toBeGreaterThan(40);
    }
  });

  it("never leaks the answer verbatim in a hint", () => {
    // A hint should name the method, not hand over the answer.
    for (const q of AUTHORED) {
      const answer = q.choices[q.answerIndex].toLowerCase();
      const hint = q.strategy.hint.toLowerCase();
      expect(hint.includes(answer), `${q.id} hint contains the answer`).toBe(false);
    }
  });
});

describe("shuffleChoices", () => {
  it("keeps the answer and diagnostics attached to the right options", () => {
    for (const q of AUTHORED) {
      const withSeconds: Challenge = { ...q, seconds: 20 };
      for (let i = 0; i < 40; i++) {
        const s = shuffleChoices(withSeconds);

        // The correct answer text must still be the one answerIndex points to.
        expect(s.choices[s.answerIndex], q.id).toBe(
          withSeconds.choices[withSeconds.answerIndex]
        );

        // Every diagnostic must still sit on the same choice text it described.
        for (const [key, note] of Object.entries(withSeconds.diagnostics)) {
          const originalText = withSeconds.choices[Number(key)];
          const newIndex = s.choices.indexOf(originalText);
          expect(s.diagnostics[newIndex], `${q.id} diagnostic drifted`).toBe(note);
        }

        expect(new Set(s.choices).size).toBe(withSeconds.choices.length);
      }
    }
  });
});

describe("subjects", () => {
  it("exposes three subjects with unique ids", () => {
    expect(SUBJECTS).toHaveLength(3);
    const ids = SUBJECTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(3);
  });

  it("builds a usable round for every subject", () => {
    for (const subject of SUBJECTS) {
      for (let attempt = 0; attempt < 30; attempt++) {
        const round = subject.buildRound();

        expect(round.length, `${subject.id} built an empty round`).toBeGreaterThan(0);

        for (const c of round) {
          expect(c.choices.length, c.id).toBeGreaterThanOrEqual(3);
          expect(c.answerIndex).toBeGreaterThanOrEqual(0);
          expect(c.answerIndex).toBeLessThan(c.choices.length);
          expect(c.prompt.trim().length).toBeGreaterThan(0);
          expect(c.seconds).toBeGreaterThanOrEqual(10);
          expect(c.strategy.explain.trim().length).toBeGreaterThan(20);
          // The correct answer must never carry a diagnostic.
          expect(c.diagnostics[c.answerIndex]).toBeUndefined();
        }
      }
    }
  });

  it("gives reading rounds a passage on every question", () => {
    for (let i = 0; i < 20; i++) {
      const round = getSubject("reading").buildRound();
      const titles = new Set(round.map((c) => c.passage?.title));
      // All questions in a round must be about the same single passage.
      expect(titles.size, "a reading round mixed passages").toBe(1);
      for (const c of round) {
        expect(c.passage, `${c.id} has no passage`).toBeDefined();
        expect(c.passage!.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });

  it("gives maths rounds a dot-array visual and no passage", () => {
    const round = getSubject("math").buildRound();
    for (const c of round) {
      expect(c.visual, `${c.id} has no visual`).toBeDefined();
      expect(c.passage).toBeUndefined();
      // The visual must actually match the fact being asked.
      expect(c.visual!.rows * c.visual!.cols).toBe(
        Number(c.choices[c.answerIndex])
      );
    }
  });

  it("allows reading more time than a quick recall question", () => {
    const reading = getSubject("reading").buildRound()[0];
    const math = getSubject("math").buildRound()[0];
    expect(reading.seconds).toBeGreaterThan(math.seconds);
  });

  it("does not always put the correct answer in the same position", () => {
    // Authored banks list the answer first, so without shuffling the demo
    // would be trivially gameable.
    const positions = new Set<number>();
    for (let i = 0; i < 60; i++) {
      for (const c of getSubject("history").buildRound()) {
        positions.add(c.answerIndex);
      }
    }
    expect(positions.size).toBeGreaterThan(1);
  });
});
