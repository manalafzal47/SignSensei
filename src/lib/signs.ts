export type Sign = {
  slug: string;
  word: string;
  category: string;
  difficulty: "Starter" | "Building" | "Fluent";
  gloss: string;
  handshape: string;
  movement: string;
  facial: string;
  space: string;
  sentence: string;
  sentenceGloss: string;
};

export const CATEGORIES = [
  "Greetings",
  "Everyday",
  "Feelings",
  "Questions",
  "People",
  "Time",
] as const;

export const SIGNS: Sign[] = [
  {
    slug: "good-morning",
    word: "Good Morning",
    category: "Greetings",
    difficulty: "Starter",
    gloss: "GOOD + MORNING",
    handshape: "Flat B hand, palm up",
    movement: "From chin outward, then forearm rises like a sunrise",
    facial: "Relaxed brows, small smile — greeting register",
    space: "Neutral space at chest height, slightly forward",
    sentence: "Good morning, did you sleep well?",
    sentenceGloss: "MORNING-GOOD, YOU SLEEP GOOD?",
  },
  {
    slug: "good-night",
    word: "Good Night",
    category: "Greetings",
    difficulty: "Starter",
    gloss: "GOOD + NIGHT",
    handshape: "Flat hand over bent non-dominant arm",
    movement: "Dominant hand arcs down past the horizon arm",
    facial: "Soft eyes, slight nod — closing a conversation",
    space: "Chest height, dropping toward the waist",
    sentence: "Good night, see you tomorrow.",
    sentenceGloss: "NIGHT-GOOD, TOMORROW SEE-YOU.",
  },
  {
    slug: "thank-you",
    word: "Thank You",
    category: "Greetings",
    difficulty: "Starter",
    gloss: "THANK-YOU",
    handshape: "Open flat hand, fingers together",
    movement: "Fingertips leave the chin, move forward toward the person",
    facial: "Warm smile, eye contact held — sincerity lives here",
    space: "Directional: aim toward the person you're thanking",
    sentence: "Thank you for helping me.",
    sentenceGloss: "YOU HELP-ME, THANK-YOU.",
  },
  {
    slug: "please",
    word: "Please",
    category: "Everyday",
    difficulty: "Starter",
    gloss: "PLEASE",
    handshape: "Flat hand on the chest",
    movement: "Circle clockwise on the chest, smooth and even",
    facial: "Raised brows for a polite request",
    space: "Center chest, stays on the body",
    sentence: "Please slow down a little.",
    sentenceGloss: "SLOW-DOWN LITTLE, PLEASE.",
  },
  {
    slug: "my-name-is",
    word: "My Name Is",
    category: "People",
    difficulty: "Building",
    gloss: "MY NAME",
    handshape: "Two H hands, then flat hand for MY",
    movement: "Flat hand to chest, then H hands tap twice",
    facial: "Neutral, brows settled — statement not question",
    space: "Starts on the body, taps in neutral space",
    sentence: "My name is Manal.",
    sentenceGloss: "MY NAME M-A-N-A-L.",
  },
  {
    slug: "nice-to-meet-you",
    word: "Nice To Meet You",
    category: "Greetings",
    difficulty: "Building",
    gloss: "NICE MEET-YOU",
    handshape: "Two 1 hands facing each other",
    movement: "NICE slides across the palm, then index fingers meet",
    facial: "Smile with a small nod; eyebrows lift on meeting",
    space: "Directional — the fingers meet between you and them",
    sentence: "Nice to meet you, I'm new here.",
    sentenceGloss: "NICE MEET-YOU. ME NEW HERE.",
  },
  {
    slug: "how-are-you",
    word: "How Are You",
    category: "Questions",
    difficulty: "Building",
    gloss: "HOW YOU?",
    handshape: "Bent hands knuckle to knuckle, then point",
    movement: "Hands roll forward and open, then index points out",
    facial: "Brows raised and held through the whole question",
    space: "Ends pointing at the person — direction carries 'you'",
    sentence: "Hi, how are you today?",
    sentenceGloss: "HI, TODAY YOU HOW?",
  },
  {
    slug: "i-understand",
    word: "I Understand",
    category: "Feelings",
    difficulty: "Building",
    gloss: "UNDERSTAND",
    handshape: "S hand at the temple, index flicks up",
    movement: "Single crisp flick — a slow flick reads as 'maybe'",
    facial: "Small nod, relaxed brows; furrowed brows negate it",
    space: "At the side of the forehead",
    sentence: "I understand, thank you for explaining.",
    sentenceGloss: "UNDERSTAND. YOU EXPLAIN, THANK-YOU.",
  },
  {
    slug: "help-me",
    word: "Help Me",
    category: "Everyday",
    difficulty: "Fluent",
    gloss: "HELP-ME",
    handshape: "A hand on a flat palm, lifted together",
    movement: "Lift both hands toward yourself — direction is the meaning",
    facial: "Brows up, slight lean forward when asking",
    space: "Moves inward: outward would mean 'I help you'",
    sentence: "Can you help me with this?",
    sentenceGloss: "THIS, YOU HELP-ME CAN?",
  },
  {
    slug: "later",
    word: "Later",
    category: "Time",
    difficulty: "Starter",
    gloss: "LATER",
    handshape: "L hand, palm facing sideways",
    movement: "Rotate the L forward like a clock hand",
    facial: "Neutral; puffed cheeks would stretch it to 'much later'",
    space: "Neutral space, slightly to the dominant side",
    sentence: "See you later!",
    sentenceGloss: "SEE-YOU LATER!",
  },
  {
    slug: "again",
    word: "Again",
    category: "Everyday",
    difficulty: "Starter",
    gloss: "AGAIN",
    handshape: "Bent hand, other hand flat palm up",
    movement: "Bent hand arcs over and taps the flat palm",
    facial: "Brows up turns it into 'again?' as a question",
    space: "Low neutral space in front of the torso",
    sentence: "Can you sign that again?",
    sentenceGloss: "THAT SIGN AGAIN, PLEASE?",
  },
  {
    slug: "have-a-lovely-day",
    word: "Have A Lovely Day",
    category: "Greetings",
    difficulty: "Fluent",
    gloss: "DAY NICE HAVE-YOU",
    handshape: "1 hand on the horizon arm for DAY",
    movement: "Arm sweeps down like the sun crossing the sky",
    facial: "Full smile, held eye contact through the phrase",
    space: "Wide sweep across neutral space, ending toward them",
    sentence: "Have a lovely day!",
    sentenceGloss: "DAY NICE HAVE-YOU!",
  },
];

export function getSign(slug: string) {
  return SIGNS.find((s) => s.slug === slug);
}

export type DialogueLine = {
  speaker: "them" | "you";
  text: string;
  slug?: string;
};

export type Dialogue = {
  id: string;
  title: string;
  scenario: string;
  minutes: number;
  level: "Starter" | "Building" | "Fluent";
  lines: DialogueLine[];
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "morning-cafe",
    title: "Morning at the café",
    scenario: "A barista greets you and asks how your day is going.",
    minutes: 3,
    level: "Starter",
    lines: [
      { speaker: "them", text: "Good morning!", slug: "good-morning" },
      { speaker: "you", text: "Good morning", slug: "good-morning" },
      { speaker: "them", text: "How are you?", slug: "how-are-you" },
      { speaker: "you", text: "Thank you", slug: "thank-you" },
      { speaker: "them", text: "Have a lovely day", slug: "have-a-lovely-day" },
      { speaker: "you", text: "Have a lovely day", slug: "have-a-lovely-day" },
    ],
  },
  {
    id: "first-meeting",
    title: "Meeting someone new",
    scenario: "Introduce yourself at a Deaf community meetup.",
    minutes: 4,
    level: "Building",
    lines: [
      { speaker: "them", text: "Hi, my name is Aron", slug: "my-name-is" },
      { speaker: "you", text: "My name is…", slug: "my-name-is" },
      { speaker: "them", text: "Nice to meet you", slug: "nice-to-meet-you" },
      { speaker: "you", text: "Nice to meet you", slug: "nice-to-meet-you" },
      { speaker: "them", text: "How are you?", slug: "how-are-you" },
      { speaker: "you", text: "I understand", slug: "i-understand" },
    ],
  },
  {
    id: "asking-again",
    title: "Asking someone to repeat",
    scenario: "Practice the repair phrases you'll use most in real life.",
    minutes: 3,
    level: "Building",
    lines: [
      { speaker: "them", text: "…and then we meet later", slug: "later" },
      { speaker: "you", text: "Again, please?", slug: "again" },
      { speaker: "them", text: "We meet later", slug: "later" },
      { speaker: "you", text: "I understand", slug: "i-understand" },
      { speaker: "you", text: "Thank you", slug: "thank-you" },
    ],
  },
];

export function getDialogue(id: string) {
  return DIALOGUES.find((d) => d.id === id);
}

export type Attempt = {
  slug: string;
  word: string;
  score: number;
  at: string;
  misses: string[];
};

export const SEED_HISTORY: Attempt[] = [
  {
    slug: "thank-you",
    word: "Thank You",
    score: 92,
    at: "Today, 9:14",
    misses: [],
  },
  {
    slug: "how-are-you",
    word: "How Are You",
    score: 64,
    at: "Today, 9:08",
    misses: ["Eyebrows dropped mid-question"],
  },
  {
    slug: "help-me",
    word: "Help Me",
    score: 48,
    at: "Yesterday, 20:41",
    misses: ["Movement went outward", "Hand too low"],
  },
  {
    slug: "good-morning",
    word: "Good Morning",
    score: 88,
    at: "Yesterday, 20:35",
    misses: [],
  },
  {
    slug: "my-name-is",
    word: "My Name Is",
    score: 71,
    at: "Mon, 18:02",
    misses: ["Second tap missing"],
  },
];
