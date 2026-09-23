import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HINT_BONUS_SECONDS } from "@/lib/mathGame";
import { SUBJECTS, type Challenge, type Subject } from "@/lib/subjects";

/* ------------------------------------------------------------------ *
 * A short practice round used as a product demo.
 *
 * The teaching rule every subject follows: a child should never advance on a
 * lucky guess. Hints name a method without revealing the answer, every answer
 * (right or wrong) is followed by the reasoning, and a wrong choice is
 * diagnosed as the specific mistake it represents.
 *
 * Question content lives in @/lib/subjects so it can be tested.
 * ------------------------------------------------------------------ */

type Phase = "picker" | "playing" | "done";

/** Dot array — shows a multiplication fact as rows of equal groups. */
function ArrayVisual({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="flex flex-col gap-1.5 w-max">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-1.5">
          {Array.from({ length: cols }).map((_, c) => (
            <span key={c} className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Demo() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("picker");
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [round, setRound] = useState<Challenge[]>([]);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [missed, setMissed] = useState<Challenge[]>([]);

  // Countdown held as an absolute deadline rather than a decrementing counter,
  // so it stays accurate when the tab is backgrounded.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [msLeft, setMsLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const recordedTimeout = useRef(false);

  const current: Challenge | undefined = round[index];

  const start = (chosenSubject: Subject) => {
    setSubject(chosenSubject);
    setRound(chosenSubject.buildRound());
    setPhase("playing");
    setIndex(0);
    setChosen(null);
    setShowHint(false);
    setUsedHint(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setMissed([]);
    setTimedOut(false);
    recordedTimeout.current = false;
  };

  const answer = (choiceIndex: number) => {
    if (chosen !== null || timedOut || !current) return;
    setChosen(choiceIndex);

    if (choiceIndex === current.answerIndex) {
      // A hint still earns points — asking for the method is the behaviour we
      // want to reward, just slightly less than working it out unaided.
      setScore((s) => s + (usedHint ? 10 : 12));
      setStreak((s) => {
        const nextStreak = s + 1;
        setBestStreak((b) => Math.max(b, nextStreak));
        return nextStreak;
      });
    } else {
      setStreak(0);
      setMissed((m) => [...m, current]);
    }
  };

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= round.length) {
      setPhase("done");
      return;
    }
    setIndex(nextIndex);
    setChosen(null);
    setShowHint(false);
    setUsedHint(false);
    setTimedOut(false);
    recordedTimeout.current = false;
  };

  // Start the clock for each new question.
  useEffect(() => {
    if (phase !== "playing" || !current) return;
    const ms = current.seconds * 1000;
    setDeadline(Date.now() + ms);
    setMsLeft(ms);
  }, [current, phase]);

  // Tick while unanswered. Stops the moment the question resolves, so nobody
  // is rushed while reading the explanation.
  useEffect(() => {
    if (phase !== "playing" || chosen !== null || timedOut || deadline === null) {
      return;
    }
    const id = setInterval(() => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        setMsLeft(0);
        setTimedOut(true);
      } else {
        setMsLeft(remaining);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, chosen, timedOut, deadline]);

  // Running out counts as a missed question, recorded once.
  useEffect(() => {
    if (!timedOut || chosen !== null || recordedTimeout.current || !current) return;
    recordedTimeout.current = true;
    setStreak(0);
    setMissed((m) => [...m, current]);
  }, [timedOut, chosen, current]);

  const isAnswered = chosen !== null;
  const isResolved = isAnswered || timedOut;
  const isCorrect = current ? chosen === current.answerIndex : false;
  const misconception =
    isAnswered && !isCorrect && chosen !== null && current
      ? (current.diagnostics[chosen] ?? null)
      : null;

  const total = round.length || 1;
  const correctCount = round.length - missed.length;

  const secondsLeft = Math.ceil(msLeft / 1000);
  const timeFraction = current
    ? Math.max(0, Math.min(1, msLeft / (current.seconds * 1000)))
    : 0;
  const timerTone =
    timeFraction > 0.4
      ? "bg-blue-600"
      : timeFraction > 0.15
        ? "bg-amber-500"
        : "bg-red-500";

  const isMath = subject.id === "math";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* ---------------- subject picker ---------------- */}
              {phase === "picker" && (
                <>
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      Try a LearnQuest Challenge
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Pick a subject. Each round works the same way our lessons do —
                      no guessing your way through, and every answer comes with the
                      reasoning behind it.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => start(s)}
                        className="text-left bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 hover:border-blue-600 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl leading-none">{s.icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{s.blurb}</p>
                            <p className="text-xs text-blue-600 font-semibold">
                              {s.skill}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        icon: "💡",
                        title: "Hints, not answers",
                        body: "Stuck? A hint points to the method, adds time to the clock, and lets the child finish the thinking.",
                      },
                      {
                        icon: "🧠",
                        title: "Every answer explained",
                        body: "Right or wrong, the reasoning is shown — so the idea actually sticks.",
                      },
                      {
                        icon: "🎯",
                        title: "Mistakes get named",
                        body: "A wrong answer is diagnosed, not just marked. Children see what went wrong.",
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                      >
                        <div className="text-4xl mb-3">{card.icon}</div>
                        <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.body}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-xs text-gray-400 max-w-md mx-auto">
                    This demo runs entirely in your browser. Your answers are not
                    recorded, stored or sent anywhere. Each question has a gentle
                    timer that stops as soon as you answer.
                  </p>
                </>
              )}

              {/* ---------------- playing ---------------- */}
              {phase === "playing" && current && (
                <>
                  <div className="flex items-center justify-between mb-3 text-sm font-semibold">
                    <span className="text-gray-600">
                      {subject.icon} {subject.name} · {index + 1} of {round.length}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600">⭐ {score} pts</span>
                      <span className="text-orange-500">🔥 {streak}</span>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${(index / total) * 100}%` }}
                    />
                  </div>

                  {/* Passage, for reading rounds */}
                  {current.passage && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                      <h2 className="font-bold text-gray-900 mb-3">
                        {current.passage.title}
                      </h2>
                      <div className="space-y-3 text-gray-700 leading-relaxed">
                        {current.passage.paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
                    {isMath ? (
                      <>
                        <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                          What is
                        </p>
                        <p className="text-center text-6xl md:text-7xl font-extrabold text-gray-900 mb-6">
                          {current.prompt.split("×")[0].trim()}{" "}
                          <span className="text-blue-600">×</span>{" "}
                          {current.prompt.split("×")[1].trim()}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-snug">
                        {current.prompt}
                      </p>
                    )}

                    {/* Countdown. Freezes once the question resolves. */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {isResolved ? "Time" : "Time to think"}
                        </span>
                        <span
                          className={
                            "text-sm font-bold tabular-nums " +
                            (isResolved
                              ? "text-gray-400"
                              : timeFraction > 0.15
                                ? "text-gray-600"
                                : "text-red-600")
                          }
                        >
                          {isResolved ? "—" : secondsLeft + "s"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={
                            "h-full rounded-full transition-[width] duration-100 ease-linear " +
                            (isResolved ? "bg-gray-300" : timerTone)
                          }
                          style={{
                            width: (isResolved ? 100 : timeFraction * 100) + "%",
                          }}
                        />
                      </div>
                    </div>

                    <div className={isMath ? "grid grid-cols-2 gap-4" : "space-y-3"}>
                      {current.choices.map((choice, i) => {
                        let cls =
                          "bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-600 hover:shadow-md";
                        if (isResolved) {
                          if (i === current.answerIndex) {
                            cls = "bg-green-50 border-2 border-green-500 text-green-700";
                          } else if (i === chosen) {
                            cls = "bg-red-50 border-2 border-red-400 text-red-700";
                          } else {
                            cls = "bg-gray-50 border-2 border-gray-200 text-gray-400";
                          }
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => answer(i)}
                            disabled={isResolved}
                            className={
                              (isMath
                                ? "py-5 rounded-xl text-3xl font-bold text-center"
                                : "w-full px-5 py-4 rounded-xl text-left font-medium leading-snug") +
                              " transition-all " +
                              cls
                            }
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>

                    {/* hint */}
                    {!isResolved && !showHint && (
                      <button
                        onClick={() => {
                          setShowHint(true);
                          setUsedHint(true);
                          // Reading a hint should never eat the clock.
                          setDeadline((d) =>
                            d === null ? d : d + HINT_BONUS_SECONDS * 1000
                          );
                        }}
                        className="mt-6 w-full py-3 rounded-lg border border-orange-300 text-orange-600 font-semibold hover:bg-orange-50 transition"
                      >
                        💡 Need a hint?{" "}
                        <span className="text-orange-400">
                          (+{HINT_BONUS_SECONDS}s)
                        </span>
                      </button>
                    )}

                    {!isResolved && showHint && (
                      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2">
                          {current.strategy.label}
                        </p>
                        <p className="text-gray-800">{current.strategy.hint}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          Take your time — the hint gives you the method, you finish
                          the thinking.
                        </p>
                      </div>
                    )}

                    {/* feedback */}
                    {isResolved && (
                      <div className="mt-6">
                        <div
                          className={`rounded-xl p-5 border ${
                            isCorrect
                              ? "bg-green-50 border-green-200"
                              : "bg-amber-50 border-amber-200"
                          }`}
                        >
                          <p
                            className={`font-bold text-lg mb-1 ${
                              isCorrect ? "text-green-700" : "text-amber-700"
                            }`}
                          >
                            {isCorrect
                              ? "✓ That is right!"
                              : timedOut
                                ? "⏱ Time is up — here is how it works"
                                : "Not quite — let us look at why"}
                          </p>

                          {timedOut && (
                            <p className="text-amber-800 text-sm mb-3">
                              No problem. Knowing the method is what makes these
                              quick later on — speed comes last, not first.
                            </p>
                          )}

                          {misconception && (
                            <p className="text-amber-800 text-sm mb-3">
                              {misconception}
                            </p>
                          )}

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-4 mb-2">
                            {current.strategy.label}
                          </p>
                          <p className="text-gray-800">{current.strategy.explain}</p>

                          {current.visual && (
                            <div className="mt-5 pt-5 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-500 mb-3">
                                {current.visual.rows} rows of {current.visual.cols} ={" "}
                                {current.visual.rows * current.visual.cols}
                              </p>
                              <div className="overflow-x-auto">
                                <ArrayVisual
                                  rows={current.visual.rows}
                                  cols={current.visual.cols}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={next}
                          className="mt-5 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all hover:shadow-lg"
                        >
                          {index + 1 >= round.length
                            ? "See my results"
                            : "Got it — next question →"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ---------------- done ---------------- */}
              {phase === "done" && (
                <>
                  <div className="text-center mb-10">
                    <div className="text-6xl mb-4">
                      {correctCount === round.length
                        ? "🏆"
                        : correctCount >= round.length * 0.7
                          ? "⭐"
                          : "📚"}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      {correctCount === round.length
                        ? "Perfect round!"
                        : correctCount >= round.length * 0.7
                          ? "Nicely done!"
                          : "Good practice!"}
                    </h1>
                    <p className="text-lg text-gray-600">
                      You got {correctCount} of {round.length} correct in{" "}
                      {subject.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                      { label: "Points", value: score, color: "text-blue-600" },
                      {
                        label: "Best streak",
                        value: bestStreak,
                        color: "text-orange-500",
                      },
                      {
                        label: "Accuracy",
                        value: `${Math.round((correctCount / total) * 100)}%`,
                        color: "text-green-600",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100"
                      >
                        <div className={`text-3xl font-extrabold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {missed.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Worth another look
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        In the full product these come back tomorrow, and again the
                        day after, until they stick.
                      </p>
                      <ul className="space-y-5">
                        {missed.map((m, i) => (
                          <li
                            key={i}
                            className="pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {m.prompt}
                            </p>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                              {m.strategy.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {m.strategy.explain}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Try another subject */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Try another subject
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {SUBJECTS.filter((s) => s.id !== subject.id).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => start(s)}
                          className="flex items-center gap-3 text-left px-4 py-3 rounded-lg border-2 border-gray-100 hover:border-blue-600 transition-all"
                        >
                          <span className="text-2xl">{s.icon}</span>
                          <span className="font-semibold text-gray-900 text-sm">
                            {s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">
                      This is a sample, for one child
                    </h2>
                    <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                      LearnQuest is being built to cover these subjects properly, with
                      progress tracking for parents and teachers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => start(subject)}
                        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                      >
                        Play again
                      </button>
                      <button
                        onClick={() => setLocation("/pricing")}
                        className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition"
                      >
                        See pricing
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
