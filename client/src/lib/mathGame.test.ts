import { describe, expect, it } from "vitest";
import {
  ROUND_LENGTH,
  buildStrategy,
  diagnose,
  makeQuestion,
} from "./mathGame";

/** Every factor pair the demo can actually generate. */
const ALL_PAIRS: [number, number][] = [];
for (let a = 1; a <= 10; a++) {
  for (let b = 1; b <= 10; b++) {
    ALL_PAIRS.push([a, b]);
  }
}

const TIMES = "×";
const DIVIDE = "÷";
const MINUS = "−";

/**
 * Pulls every arithmetic claim ("3 + 3 + 3 = 9") out of prose and evaluates it.
 * Handles chained addition, not just binary operations.
 */
function arithmeticClaims(text: string) {
  const claims: { ok: boolean; claim: string }[] = [];
  const ops = `[+${MINUS}${TIMES}${DIVIDE}]`;
  const re = new RegExp(
    `(\\d+(?:\\s*${ops}\\s*\\d+)+)\\s*=\\s*(\\d+)`,
    "g"
  );
  const tokenRe = new RegExp(`\\d+|${ops}`, "g");

  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const expr = m[1];
    const stated = Number(m[2]);
    const tokens = expr.match(tokenRe) ?? [];

    // Pass 1: resolve × and ÷.
    const reduced: (number | string)[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t === TIMES || t === DIVIDE) {
        const left = reduced.pop() as number;
        const right = Number(tokens[++i]);
        reduced.push(t === TIMES ? left * right : left / right);
      } else if (t === "+" || t === MINUS) {
        reduced.push(t);
      } else {
        reduced.push(Number(t));
      }
    }

    // Pass 2: resolve + and − left to right.
    let acc = reduced[0] as number;
    for (let i = 1; i < reduced.length; i += 2) {
      const op = reduced[i] as string;
      const val = reduced[i + 1] as number;
      acc = op === "+" ? acc + val : acc - val;
    }

    claims.push({ ok: acc === stated, claim: `${expr} = ${stated}` });
  }
  return claims;
}

describe("arithmeticClaims (test helper)", () => {
  // Guards against the parser silently matching nothing and making the
  // explanation tests pass vacuously.
  it("parses chained addition", () => {
    expect(arithmeticClaims("Three groups: 3 + 3 + 3 = 9.")).toEqual([
      { ok: true, claim: "3 + 3 + 3 = 9" },
    ]);
  });

  it("parses each operator and catches a false claim", () => {
    expect(arithmeticClaims(`7 ${TIMES} 5 = 35`)[0].ok).toBe(true);
    expect(arithmeticClaims(`70 ${MINUS} 7 = 63`)[0].ok).toBe(true);
    expect(arithmeticClaims(`90 ${DIVIDE} 2 = 45`)[0].ok).toBe(true);
    expect(arithmeticClaims(`7 ${TIMES} 5 = 36`)[0].ok).toBe(false);
  });
});

describe("buildStrategy", () => {
  it("makes at least one checkable arithmetic claim per fact", () => {
    for (const [a, b] of ALL_PAIRS) {
      const { explain } = buildStrategy(a, b);
      expect(
        arithmeticClaims(explain).length,
        `${a} ${TIMES} ${b} explanation has no parseable arithmetic: ${explain}`
      ).toBeGreaterThan(0);
    }
  });

  it("states arithmetic that is actually true", () => {
    for (const [a, b] of ALL_PAIRS) {
      const { explain } = buildStrategy(a, b);
      for (const { ok, claim } of arithmeticClaims(explain)) {
        expect(
          ok,
          `${a} ${TIMES} ${b}: bad claim "${claim}" in: ${explain}`
        ).toBe(true);
      }
    }
  });

  it("ends every explanation at the correct product", () => {
    for (const [a, b] of ALL_PAIRS) {
      const { explain } = buildStrategy(a, b);
      expect(explain, `${a} ${TIMES} ${b} explanation omits ${a * b}`).toContain(
        String(a * b)
      );
    }
  });

  it("never leaks the answer in a hint", () => {
    for (const [a, b] of ALL_PAIRS) {
      const product = a * b;
      // Skip facts where the product is a factor (1 × 7 = 7), since naming
      // the factor in the hint is unavoidable there.
      if (product === a || product === b) continue;
      const { hint } = buildStrategy(a, b);
      const leaks = new RegExp(`\\b${product}\\b`).test(hint);
      expect(leaks, `${a} ${TIMES} ${b} hint leaks ${product}: ${hint}`).toBe(
        false
      );
    }
  });

  it("always names a strategy", () => {
    for (const [a, b] of ALL_PAIRS) {
      expect(buildStrategy(a, b).label.length).toBeGreaterThan(0);
    }
  });
});

describe("diagnose", () => {
  it("returns nothing for the correct answer", () => {
    expect(diagnose(56, 7, 8)).toBeNull();
  });

  it("recognises adding instead of multiplying", () => {
    expect(diagnose(11, 7, 4)).toContain("7 + 4");
  });

  it("recognises one group too few", () => {
    // 7 × 8 = 56; 48 is 6 groups of 8.
    expect(diagnose(48, 7, 8)).toContain("6 groups of 8");
  });

  it("recognises one group too many", () => {
    // 7 × 8 = 56; 64 is 8 groups of 8.
    expect(diagnose(64, 7, 8)).toContain("8 groups of 8");
  });
});

describe("makeQuestion", () => {
  it("produces a solvable, well-formed question at every round position", () => {
    for (let round = 0; round < 200; round++) {
      for (let i = 0; i < ROUND_LENGTH; i++) {
        const q = makeQuestion(i);

        expect(q.product).toBe(q.a * q.b);
        expect(q.choices).toHaveLength(4);
        expect(q.choices).toContain(q.product);
        expect(new Set(q.choices).size, `duplicate choices: ${q.choices}`).toBe(
          4
        );

        for (const c of q.choices) {
          expect(c).toBeGreaterThan(0);
        }
      }
    }
  });

  it("handles square facts, which collapse the distractor pool", () => {
    // 2 × 2 and 3 × 3 previously yielded only three choices.
    for (let i = 0; i < 50; i++) {
      for (const n of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        const p = n * n;
        const candidates = [p - n, p + n, n + n, (n + 1) * n, n * (n + 1)];
        const distinct = new Set(candidates.filter((c) => c !== p && c > 0));
        // Where the pool is thin, filler must still make four choices possible.
        expect(distinct.size + 6).toBeGreaterThanOrEqual(3);
      }
    }
    // And the real generator must never produce fewer than four.
    for (let i = 0; i < 500; i++) {
      expect(makeQuestion(i % ROUND_LENGTH).choices).toHaveLength(4);
    }
  });

  it("gets harder as the round progresses", () => {
    const early: number[] = [];
    const late: number[] = [];
    for (let i = 0; i < 300; i++) {
      early.push(makeQuestion(0).product);
      late.push(makeQuestion(9).product);
    }
    const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
    expect(mean(late)).toBeGreaterThan(mean(early));
  });

  it("offers distractors that a mistake would actually produce", () => {
    for (let i = 0; i < 300; i++) {
      const q = makeQuestion(i % ROUND_LENGTH);
      const wrong = q.choices.filter((c) => c !== q.product);
      // At least one wrong choice should be explainable as a named error.
      const explained = wrong.some((c) => diagnose(c, q.a, q.b) !== null);
      expect(
        explained,
        `${q.a} ${TIMES} ${q.b} had no diagnosable distractor: ${wrong}`
      ).toBe(true);
    }
  });
});
