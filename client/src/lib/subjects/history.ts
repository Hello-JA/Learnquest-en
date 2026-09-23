import type { Challenge, Subject } from "./types";
import { shuffle, shuffleChoices } from "./types";

/**
 * History and social studies (US focus, elementary level).
 *
 * Questions ask for reasoning — why something happened, what a role is for,
 * how sources work — rather than isolated dates to memorise. Where a date
 * matters, the explanation says why the order makes sense, so it can be
 * reasoned out rather than recalled.
 */

const QUESTIONS: Omit<Challenge, "seconds">[] = [
  {
    id: "hist-branches",
    prompt:
      "Congress passes a new law. Which branch of government decides whether that law is allowed by the Constitution?",
    choices: [
      "The judicial branch — the courts",
      "The legislative branch — Congress",
      "The executive branch — the President",
      "The states vote on it",
    ],
    answerIndex: 0,
    strategy: {
      label: "What each branch is for",
      hint: "Each branch has one job: one writes laws, one carries them out, one interprets them. Which job is being described here?",
      explain:
        "The courts interpret laws, and can rule that a law conflicts with the Constitution. Congress writes laws and the President carries them out. This split is what “checks and balances” means — no single branch gets to do everything.",
    },
    diagnostics: {
      1: "Congress wrote the law in the first place. Letting it judge its own work is exactly what checks and balances are designed to prevent.",
      2: "The President can veto a bill before it becomes law, which is a real check — but deciding what the Constitution allows is the courts' job.",
      3: "States have their own powers, but they do not vote on whether a federal law is constitutional.",
    },
  },
  {
    id: "hist-stamp-act",
    prompt: "Why did many colonists object so strongly to the Stamp Act?",
    choices: [
      "They were being taxed by a Parliament they had no representatives in",
      "The tax was the largest sum ever collected in history",
      "It made printing newspapers illegal",
      "They disliked the design printed on the stamps",
    ],
    answerIndex: 0,
    strategy: {
      label: "Finding the real grievance",
      hint: "The colonists had a slogan about this. It was not about how much the tax cost — it was about what was missing.",
      explain:
        "The Stamp Act of 1765 taxed printed material. The anger was less about the amount than the principle: colonists had no representatives in Parliament, so they argued Parliament had no right to tax them. That is the origin of “no taxation without representation.”",
    },
    diagnostics: {
      1: "The amount was not extraordinary. Focusing on cost misses the argument the colonists were actually making.",
      2: "It taxed printed material rather than banning it. Newspapers kept printing — and campaigned loudly against the tax.",
      3: "This was a serious constitutional argument, not a complaint about appearance.",
    },
  },
  {
    id: "hist-continent",
    prompt: "A classmate says “Africa is a country.” Why is that not right?",
    choices: [
      "Africa is a continent, and contains more than 50 countries",
      "Africa is a country, just an unusually large one",
      "Africa is an ocean, not land",
      "Africa is a region inside a country",
    ],
    answerIndex: 0,
    strategy: {
      label: "Continent or country?",
      hint: "Think about what makes something a country. Which one has its own government and borders?",
      explain:
        "A country has its own government, borders and laws. A continent is a large landmass that can hold many countries. Africa is a continent containing over 50 countries, each with its own government, languages and flag — Nigeria, Kenya and Egypt are all quite different places.",
    },
    diagnostics: {
      1: "Size is not the issue. Russia is enormous and is a country; Africa is not one, because it has many governments rather than one.",
      2: "Africa is land. The oceans around it include the Atlantic and Indian.",
      3: "It is the other way round — countries sit inside the continent.",
    },
  },
  {
    id: "hist-order",
    prompt:
      "Which came first: the Declaration of Independence, or the U.S. Constitution?",
    choices: [
      "The Declaration of Independence",
      "The Constitution",
      "They were signed on the same day",
      "The Constitution, by about fifty years",
    ],
    answerIndex: 0,
    strategy: {
      label: "Reasoning out the order",
      hint: "One document announces that a new country exists. The other sets out how it will be governed. Which has to happen first?",
      explain:
        "The Declaration of Independence came in 1776 and announced separation from Britain. The Constitution followed in 1787 to set up how the new country would be governed. You can work this out without the dates: a country has to exist before it can write the rules for running itself.",
    },
    diagnostics: {
      1: "This reverses the order. There was no United States to write a constitution for until independence had been declared.",
      2: "They are eleven years apart — 1776 and 1787.",
      3: "The gap is eleven years, and in the other direction.",
    },
  },
  {
    id: "hist-primary-source",
    prompt:
      "Why do historians pay special attention to letters and diaries written at the time of an event?",
    choices: [
      "They come from people who were actually there",
      "They are always completely accurate",
      "They are shorter than textbooks",
      "They are easier to read than modern writing",
    ],
    answerIndex: 0,
    strategy: {
      label: "Primary sources",
      hint: "Think about the difference between hearing a story from someone who was there and hearing it passed along third-hand.",
      explain:
        "A primary source was made by someone who witnessed the event, which makes it direct evidence rather than a retelling. It still only shows one person's view, though — which is exactly why historians compare several sources instead of trusting one.",
    },
    diagnostics: {
      1: "Being present does not make someone accurate or unbiased. People misremember and take sides — that is precisely why historians cross-check.",
      2: "Length has nothing to do with it, and old letters are often long.",
      3: "Older handwriting and language are usually harder to read, not easier.",
    },
  },
  {
    id: "hist-voting",
    prompt: "Why do citizens vote in elections?",
    choices: [
      "To choose the people who will represent them in government",
      "To decide which state is the largest",
      "Because the Constitution must be rewritten each year",
      "To pick whichever candidate has the most money",
    ],
    answerIndex: 0,
    strategy: {
      label: "What representation means",
      hint: "The word “representative” is a clue. Who are those people meant to be speaking for?",
      explain:
        "In a representative democracy, citizens cannot all vote on every decision, so they choose people to make decisions on their behalf. Voting is how that choice is made — and how those representatives can be replaced if people are unhappy.",
    },
    diagnostics: {
      1: "State sizes are measured, not voted on.",
      2: "The Constitution is not rewritten annually. It has been amended only 27 times in over two centuries.",
      3: "Money is spent on campaigns, but the votes decide the winner.",
    },
  },
];

const SECONDS = 25;
const ROUND = 5;

export const historySubject: Subject = {
  id: "history",
  name: "History",
  icon: "🏛️",
  blurb: "Reason about why things happened, not just when.",
  skill: "Cause and effect, civics and sources",
  buildRound() {
    return shuffle(QUESTIONS)
      .slice(0, ROUND)
      .map((q) => shuffleChoices({ ...q, seconds: SECONDS }));
  },
};

/** Exposed for tests. */
export const HISTORY_QUESTIONS = QUESTIONS;
