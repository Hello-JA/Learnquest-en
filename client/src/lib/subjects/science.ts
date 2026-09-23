import type { Challenge, Subject } from "./types";
import { shuffle, shuffleChoices } from "./types";

/**
 * Basic science.
 *
 * Each question targets a misconception that is genuinely common in primary
 * science, so the wrong answers are the ones children actually pick and the
 * diagnosis has something real to correct. Explanations give the mechanism
 * rather than restating the fact.
 */

const QUESTIONS: Omit<Challenge, "seconds">[] = [
  {
    id: "sci-plant-mass",
    prompt:
      "A sunflower seed grows into a plant taller than you. Where does most of that new material come from?",
    choices: [
      "Carbon dioxide taken from the air",
      "The soil it grows in",
      "Water, and nothing else",
      "The sunlight it absorbs",
    ],
    answerIndex: 0,
    strategy: {
      label: "Where matter comes from",
      hint: "A plant builds sugar during photosynthesis. Think about which ingredient supplies the carbon that sugar is built from — and where the plant gets it.",
      explain:
        "Most of a plant's dry material is carbon, and that carbon comes from carbon dioxide the plant pulls out of the air. Soil provides water and small amounts of minerals, and sunlight provides the energy to do the work — but the building material is mostly air.",
    },
    diagnostics: {
      1: "Almost everyone says soil, and it feels obvious. But if you weigh the soil before and after a plant grows in it, hardly any is missing — so the plant's mass must be coming from somewhere else.",
      2: "Water does contribute, supplying hydrogen and some oxygen. But the carbon backbone of the plant comes from the air.",
      3: "Sunlight is energy, not matter. Energy has no mass to add to the plant — it powers the process rather than becoming part of the plant.",
    },
  },
  {
    id: "sci-evaporation",
    prompt:
      "A puddle dries up on a warm day, even though it never gets close to boiling. How?",
    choices: [
      "The fastest molecules at the surface escape as vapour",
      "Water can only turn to gas at 100°C, so it soaked into the ground",
      "The sun destroys the water",
      "The air absorbs it into tiny holes",
    ],
    answerIndex: 0,
    strategy: {
      label: "Evaporation versus boiling",
      hint: "Not every molecule in the puddle is moving at the same speed. Think about the fastest ones, and where they are.",
      explain:
        "Molecules in a puddle move at a whole range of speeds. The fastest ones at the surface can break away and become vapour at any temperature. Boiling is different — that is when this happens throughout the liquid at once, which is why it needs a specific temperature.",
    },
    diagnostics: {
      1: "This mixes up evaporating and boiling. Boiling needs 100°C, but evaporation happens at any temperature — which is why wet clothes dry on a cold day too.",
      2: "Matter is not destroyed. The water is still there, spread out through the air as an invisible gas.",
      3: "Air is not a sponge with holes. The water becomes a gas and mixes among the air molecules.",
    },
  },
  {
    id: "sci-falling",
    prompt:
      "On the Moon, where there is no air, an astronaut drops a hammer and a feather at the same moment. What happens?",
    choices: [
      "They land at the same time",
      "The hammer lands clearly first",
      "The feather lands first",
      "The feather floats and never lands",
    ],
    answerIndex: 0,
    strategy: {
      label: "What actually slows a feather",
      hint: "On Earth the feather is slowed by something the Moon does not have. Take that away, and ask what is left to make a difference.",
      explain:
        "Gravity accelerates everything at the same rate regardless of mass. On Earth, air resistance slows the feather down. With no air on the Moon, both fall together and land at the same moment. Astronaut David Scott actually did this on Apollo 15 in 1971, and they landed together.",
    },
    diagnostics: {
      1: "This is the most common answer, and it is right on Earth because of air. A heavier object does feel a stronger pull — but it is also harder to get moving, and the two effects cancel exactly.",
      2: "Nothing here would make a feather fall faster than a hammer.",
      3: "The Moon does have gravity, about one sixth of Earth's. Things fall there, just more gently.",
    },
  },
  {
    id: "sci-whale",
    prompt:
      "A whale lives in the ocean and swims all its life. Why do scientists call it a mammal rather than a fish?",
    choices: [
      "It breathes air with lungs and feeds its young milk",
      "It is far too large to count as a fish",
      "It comes to the surface, and fish never do",
      "It has no scales",
    ],
    answerIndex: 0,
    strategy: {
      label: "Grouping by body, not habitat",
      hint: "Scientists group animals by how their bodies work, not by where they happen to live. Think about what every mammal has in common.",
      explain:
        "Mammals breathe air with lungs, are warm-blooded, and feed their young on milk. Whales do all three. Where an animal lives does not decide its group — which is why a whale is a mammal while a shark, living in the same water, is a fish.",
    },
    diagnostics: {
      1: "Size does not decide a group. The whale shark is enormous and is still a fish.",
      2: "Some fish do come to the surface, and plenty of mammals rarely do. This is not what separates the groups.",
      3: "Having no scales is a clue, but it is not the reason on its own — some fish have no scales either.",
    },
  },
  {
    id: "sci-day-night",
    prompt: "What causes day and night?",
    choices: [
      "The Earth spins once roughly every 24 hours",
      "The Sun travels around the Earth each day",
      "The Earth travels around the Sun",
      "Clouds cover the Sun at night",
    ],
    answerIndex: 0,
    strategy: {
      label: "What is actually moving",
      hint: "Something is turning here. The question is whether it is the Earth or the Sun — and how long one turn takes.",
      explain:
        "The Earth spins on its axis roughly once every 24 hours. The side facing the Sun has daytime; the side turned away has night. The Sun stays put while we turn.",
    },
    diagnostics: {
      1: "From the ground it certainly looks that way, since the Sun appears to cross the sky. But it is the Earth turning beneath it that creates the effect.",
      2: "This is a real motion, but it takes a whole year and causes the seasons — not the daily change from light to dark.",
      3: "Night falls on clear nights too, so clouds cannot be the cause.",
    },
  },
  {
    id: "sci-water-cycle",
    prompt: "Where did the water in a rain cloud come from?",
    choices: [
      "It evaporated from oceans, lakes and rivers",
      "It is newly made high in the atmosphere",
      "It arrives from space as ice",
      "It leaks upward from underground",
    ],
    answerIndex: 0,
    strategy: {
      label: "Following the water cycle",
      hint: "Think about where the water in a drying puddle goes. Now follow it upward and ask what happens when it cools.",
      explain:
        "The Sun heats water at the surface, it evaporates into vapour and rises. Higher up it cools and condenses into tiny droplets, which gather into clouds. It is the same water going round and round — not new water each time.",
    },
    diagnostics: {
      1: "Water is not manufactured in the sky. The cycle moves existing water around rather than creating more.",
      2: "A tiny amount of water did arrive from space long ago, but rain comes from water already here.",
      3: "Groundwater exists, but it does not rise into the sky by itself — it has to evaporate from the surface first.",
    },
  },
];

const SECONDS = 25;
const ROUND = 5;

export const scienceSubject: Subject = {
  id: "science",
  name: "Science",
  icon: "🔬",
  blurb: "Work out why things happen, not just what happens.",
  skill: "Mechanisms and common misconceptions",
  buildRound() {
    return shuffle(QUESTIONS)
      .slice(0, ROUND)
      .map((q) => shuffleChoices({ ...q, seconds: SECONDS }));
  },
};

/** Exposed for tests. */
export const SCIENCE_QUESTIONS = QUESTIONS;
