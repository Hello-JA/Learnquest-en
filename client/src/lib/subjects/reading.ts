import type { Challenge, Passage, Subject } from "./types";
import { shuffle, shuffleChoices } from "./types";

/**
 * Reading comprehension.
 *
 * Questions target the skills that actually transfer — finding the main idea,
 * drawing an inference, and working out a word from context — rather than
 * hunting for a matching string. Distractors are the real errors children make:
 * mistaking a detail for the main idea, going further than the text allows, and
 * importing outside knowledge the passage never stated.
 *
 * A round keeps one passage and asks every question about it, so the child
 * reads once and thinks several times.
 */

type PassageSet = {
  passage: Passage;
  questions: Omit<Challenge, "passage" | "seconds">[];
};

const SECONDS_PER_QUESTION = 35;

const SETS: PassageSet[] = [
  {
    passage: {
      title: "The Octopus and Its Three Hearts",
      paragraphs: [
        "An octopus has three hearts. Two of them push blood to the gills, where the blood collects oxygen from the water. The third heart then pumps that oxygen-rich blood out to the rest of the body.",
        "Oddly, the third heart stops beating whenever an octopus swims. This is why octopuses usually crawl along the sea floor instead. Swimming exhausts them, so they save it for when they must.",
      ],
    },
    questions: [
      {
        id: "read-octo-main",
        prompt: "What is this passage mostly about?",
        choices: [
          "How an octopus's hearts work",
          "Why ocean water contains oxygen",
          "How fast an octopus can swim",
          "Where octopuses build their homes",
        ],
        answerIndex: 0,
        strategy: {
          label: "Finding the main idea",
          hint: "Look at what almost every sentence is describing. A main idea has to cover the whole passage, not just one line of it.",
          explain:
            "Every sentence is about the hearts — how many there are, what each one does, and what happens to the third when the octopus swims. That is the thread running through the whole passage, which makes it the main idea.",
        },
        diagnostics: {
          1: "Oxygen is mentioned, but only to explain what the hearts are doing. A detail that supports the main idea is not the main idea itself.",
          2: "The passage never says how fast an octopus swims. Be careful not to fill in gaps with what you already know.",
          3: "The sea floor appears in one sentence, and only to explain the crawling. One sentence cannot be what the whole passage is about.",
        },
      },
      {
        id: "read-octo-infer",
        prompt: "Why do octopuses usually crawl instead of swimming?",
        choices: [
          "Swimming stops one of their hearts, which tires them out",
          "They are not able to swim at all",
          "Crawling moves them faster than swimming",
          "There is more oxygen near the sea floor",
        ],
        answerIndex: 0,
        strategy: {
          label: "Cause and effect",
          hint: "The last two sentences give a cause and an effect. Find the cause, then check it explains the crawling.",
          explain:
            "The passage says the third heart stops beating when an octopus swims, and that swimming exhausts them. Crawling avoids stopping that heart, so it is what they normally do.",
        },
        diagnostics: {
          1: "The passage says swimming tires them, not that they cannot do it — it even says they save it for when they must. Watch for answers that go further than the text.",
          2: "The passage never compares the two speeds, so there is nothing to support this.",
          3: "This sounds sensible, but the passage does not say it. An answer has to come from the text, not from what seems reasonable.",
        },
      },
      {
        id: "read-octo-vocab",
        prompt: "In this passage, the word “exhausts” most nearly means:",
        choices: ["tires out", "empties completely", "irritates", "burns as fuel"],
        answerIndex: 0,
        strategy: {
          label: "Working out a word from context",
          hint: "This word has more than one meaning. Read the sentence around it and ask which meaning fits what is happening to the octopus.",
          explain:
            "The sentence explains why octopuses avoid swimming: a heart stops and the effort wears them down. Of the meanings “exhaust” can have, “tires out” is the one that fits this sentence.",
        },
        diagnostics: {
          1: "“Exhaust” can mean to empty something, but nothing is being emptied here — the octopus is being worn out.",
          3: "That is the meaning you meet in a car exhaust. Context decides which meaning of a word applies.",
        },
      },
      {
        id: "read-octo-detail",
        prompt: "How many of the octopus's hearts send blood to the gills?",
        choices: ["Two", "One", "Three", "None"],
        answerIndex: 0,
        strategy: {
          label: "Locating a stated detail",
          hint: "This one is said outright. Find the sentence that mentions the gills and read it carefully.",
          explain:
            "The passage says “Two of them push blood to the gills.” The remaining heart sends blood to the rest of the body, which makes three in total.",
        },
        diagnostics: {
          1: "One heart serves the body, not the gills. It is easy to swap the two jobs, so reread which is which.",
          2: "Three is the total number of hearts. The question asks only about the ones serving the gills.",
        },
      },
    ],
  },
  {
    passage: {
      title: "Maya's Missing Key",
      paragraphs: [
        "Maya patted her pockets for the third time. Empty. She had definitely locked the front door that morning — she could still remember the click.",
        "She sat down on the step and walked back through her day: the bus, the library, the long way home past the bakery.",
        "Then she pictured the library desk, and the small metal sound her bag had made when she set it down.",
      ],
    },
    questions: [
      {
        id: "read-maya-infer",
        prompt: "Where is Maya's key most likely to be?",
        choices: [
          "At the library",
          "In her coat pocket",
          "At the bakery",
          "On the bus",
        ],
        answerIndex: 0,
        strategy: {
          label: "Following the writer's clue",
          hint: "The last sentence is a clue rather than a statement. Ask yourself why the writer chose to mention a small metal sound.",
          explain:
            "The story ends with Maya remembering a metal sound at the library desk as she put her bag down. The writer never says the key fell out there, but that is what the clue points to. Good readers follow clues instead of waiting to be told.",
        },
        diagnostics: {
          1: "The very first lines rule this out — she patted her pockets and found them empty.",
          2: "The bakery is mentioned as part of her route, but nothing happens there. Being mentioned is not the same as being important.",
          3: "The bus is on her list too, but the writer gives a clue about only one of these places.",
        },
      },
      {
        id: "read-maya-feeling",
        prompt: "How does Maya most likely feel at the start of the story?",
        choices: ["Worried", "Excited", "Bored", "Angry"],
        answerIndex: 0,
        strategy: {
          label: "Reading feelings from actions",
          hint: "The writer never names the feeling. Look at what Maya does instead — what does checking your pockets three times suggest?",
          explain:
            "Patting her pockets three times and finding them empty shows anxious searching. Writers often show a feeling through a character's actions rather than naming it, and your job is to read the action.",
        },
        diagnostics: {
          1: "Nothing good has happened to her — she has lost something she needs.",
          2: "She is doing the opposite of nothing: she is searching and retracing her day.",
          3: "Anger is possible in a situation like this, but the actions shown are searching and remembering, which point to worry.",
        },
      },
      {
        id: "read-maya-sequence",
        prompt: "According to the story, which happened first?",
        choices: [
          "Maya locked the front door",
          "Maya sat down on the step",
          "Maya set her bag on the library desk",
          "Maya walked past the bakery",
        ],
        answerIndex: 0,
        strategy: {
          label: "Putting events in order",
          hint: "The story is not told in the order things happened. Work out the real order from the clues, not from which sentence you read first.",
          explain:
            "Maya locked the door “that morning,” before she went anywhere. The library, the bakery and finally sitting on the step all came afterwards. Stories often jump about in time, so the order on the page is not always the order of events.",
        },
        diagnostics: {
          1: "Sitting on the step is happening now, at the end of her day — it is the last of these, not the first.",
          2: "The library came during her day, after she had already locked the door and left.",
          3: "She passes the bakery on the way home, so this is near the end of her day.",
        },
      },
    ],
  },
];

export const readingSubject: Subject = {
  id: "reading",
  name: "Reading",
  icon: "📖",
  blurb: "Read a short passage and answer questions about it.",
  skill: "Main idea, inference and vocabulary in context",
  buildRound() {
    const set = SETS[Math.floor(Math.random() * SETS.length)];
    // Questions stay in order so the easier ones come first, but the options
    // within each are shuffled.
    return set.questions.map((q) =>
      shuffleChoices({
        ...q,
        passage: set.passage,
        seconds: SECONDS_PER_QUESTION,
      })
    );
  },
};

/** Exposed for tests. */
export const READING_SETS = SETS;
export { shuffle };
