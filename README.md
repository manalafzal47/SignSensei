# SignSense Pro

A browser-based ASL practice app that helps beginners learn signs through guided repetition, webcam feedback, and contextual vocabulary review.

## Product goal

This project is not trying to be a perfect AI sign-language translator. It is a focused MVP for a real user need:

> Learners want a low-pressure, bite-sized way to practice signs, get instant feedback, and build confidence without needing a teacher in the room.

The app currently combines:
- searchable sign vocabulary
- category-based review
- favourite word tracking
- webcam-enabled practice flow
- MediaPipe-based hand landmark detection
- sign reference guidance with contextual sentences

The next step is to turn this into a credible, well-engineered prototype that could be presented in interviews and portfolio reviews.

---

## Problem being solved

Learning sign language is difficult because meanings are often carried by:
- facial expression
- handshape
- movement
- spatial position
- body posture
- direction

Most beginner resources are either too overwhelming or too passive. Learners need short, targeted lessons and immediate feedback on what they are doing wrong.

This app addresses that by making practice feel structured and approachable.

---

## Core user experience

### Primary flow
1. User opens the library and searches for a sign.
2. User picks a word from a category or favourites list.
3. User watches a replay of the target sign.
4. User attempts the sign using their webcam.
5. The app evaluates the attempt with landmark-derived feedback.
6. User retries and improves over time.

### Learning model
- beginner-friendly vocabulary
- contextual usage examples
- retry loop with meaningful feedback
- practice history that supports reinforcement

---

## MVP definition

The target MVP for this project is:

- searchable sign library
- category filtering and favourites
- practice route for each sign
- live webcam capture with hand landmark detection
- target sign replay and guidance
- scoring based on tracked motion features
- simple feedback summary for each attempt
- recent attempts / practice history
- polished UI and clear empty/loading states
- project documentation that explains the app honestly

### Explicitly out of scope for this launch version
- full ASL translation
- production-grade sign recognition model
- user accounts or backend auth
- social features or community feed
- advanced 3D sign rendering
- enterprise-grade analytics pipeline

---

## Technical stack

- React + TypeScript
- Vite
- TanStack Router
- Tailwind UI patterns
- MediaPipe Tasks Vision for hand landmark detection
- local browser-first architecture

This stack is appropriate for a polished frontend prototype and keeps the app fast and portable.

---

## Current project structure

- src/routes/library.tsx — sign library and favourites flow
- src/routes/practice.$slug.tsx — main practice experience
- src/components/HandTracker.tsx — camera + MediaPipe tracking
- src/lib/signs.ts — vocabulary and sign metadata
- src/components/AppShell.tsx — layout shell and navigation

---

## Honest product positioning

This app should be described as:

> A browser-based sign language learning app for beginner practice, using webcam-based motion feedback and structured drill progression.

It should not be marketed as:
- a perfect ASL recognition engine
- a production language-learning platform
- a replacement for certified instruction

This distinction matters for credibility in interviews, portfolios, and demos.

---

## Implementation backlog

The steps below are the concrete, ordered backlog to complete this project in a way that reads like a serious product rather than a prototype.

### Phase 1 — project cleanup and product clarity

#### Task 1: define the final MVP and scope
- confirm the user flow from library -> sign practice -> feedback -> retry
- remove features that are not needed for the demo
- document the product as a beginner sign tutor, not a general translation system

#### Task 2: clean up app architecture
- separate sign data, scoring logic, and UI concerns
- ensure route-level data flow is explicit and typed
- remove dead code or placeholder logic that is not tied to real behavior

#### Task 3: improve app reliability
- standardize loading states
- add graceful camera permission handling
- add empty states for no search results or no favourites
- improve visual consistency across screens

### Phase 2 — build the real practice engine

#### Task 4: create a typed sign profile model
Add a model that includes:
- slug
- word
- category
- difficulty
- gloss
- handshape
- movement
- orientation
- spatial position
- facial cues
- common mistakes
- feedback hints

This keeps the recognition logic strongly tied to real sign definitions instead of loose strings.

#### Task 5: extract landmark feature vectors
Create a practice utility that does the following:
- collect a sequence of landmark frames from the webcam
- normalize coordinates relative to the hand position in frame
- compute key metrics like:
  - palm center movement
  - finger spread
  - wrist trajectory
  - hand orientation
  - height and depth relative to torso

#### Task 6: build a sign comparison engine
Create a scoring function that compares:
- handshape similarity
- movement path similarity
- direction and spatial placement
- hand count
- confidence threshold from landmark detection

This should generate a weighted score out of 100.

### Phase 3 — build the feedback loop

#### Task 7: replace placeholder scoring with meaningful feedback
The current result screen in src/routes/practice.$slug.tsx should evolve from a simplistic tracking score into a structured feedback summary like:
- “Your hand is too low”
- “Movement is too short”
- “Palm orientation is off”
- “Try keeping your hand closer to your chest”

#### Task 8: add retry behavior that teaches
- allow user to retry immediately
- provide a gradually improving score for attempts
- record misses and “what to improve next”

#### Task 9: add practice history
Track:
- sign name
- timestamp
- score
- notable misses
- improvement trend

This makes the app feel useful over time instead of like a one-off demo.

### Phase 4 — learning UX

#### Task 10: improve the sign library experience
- stronger search and category UX
- favourite words dashboard
- “review queue” for missed words
- difficulty progression

#### Task 11: add contextual usage
For each sign, show:
- example sentence
- natural phrase usage
- beginner-friendly explanation
- common mistakes

#### Task 12: add motivation layers
- streak / progress vibe
- mastery indicators
- suggested daily word or short review set

This is where the app starts feeling like a real learning product instead of a moving demo.

### Phase 5 — testing and credibility

#### Task 13: add unit tests for scoring logic
Test:
- score normalization
- feature extraction edge cases
- feedback logic thresholds
- result summary generation

#### Task 14: add UI tests for core flow
Test:
- searching for a sign
- adding/removing favourites
- starting a practice attempt
- retry flow
- result state rendering

#### Task 15: run QA on the browser flow
- camera access
- permission denial
- no-hand-detection state
- low-light / bad angle behavior
- result reliability

### Phase 6 — portfolio polish

#### Task 16: clean up marketing copy
- tighten product description
- improve README
- create a polished landing story

#### Task 17: build a demo script
Prepare a short demo:
1. search a sign
2. start practice
3. show feedback and retry
4. explain the technical system
5. explain limitations honestly

#### Task 18: document architecture and trade-offs
Include:
- why MediaPipe was chosen
- what the app does well
- what the app does not do yet
- technical decisions and constraints

---

## Recommended execution order

The most important sequence is:

1. define the MVP and honest positioning
2. refactor the app into a clean architecture
3. build the sign feature extraction and scoring engine
4. replace placeholder scoring in practice flow
5. add feedback and history
6. test and polish
7. prepare the portfolio demo

This order matters because the app will otherwise look polished while the core behavior remains weak.

---

## Development commands

```bash
npm install
npm run dev
```

To build production output:

```bash
npm run build
```

---

## Demo script for interviews

> I built a browser-based ASL practice app that helps beginners practice signs with webcam feedback and structured review. The app uses MediaPipe to detect hand landmarks, extracts motion features from each attempt, and compares them against a target sign profile to generate helpful guidance. The current version focuses on beginner-friendly practice and feedback loops rather than full ASL translation, which keeps the project honest, usable, and explainable in a portfolio setting.

---

## Final recommendation

The right next move is not to chase a massive language model or full sign-recognition platform. The right next move is to make this app feel like a real product:
- clear flow
- meaningful scoring
- useful feedback
- polished result UX
- strong documentation

That is the version that will impress recruiters and internships.

---

## Project status

This project is in a strong prototype stage with a solid visual direction and usable concept. It is not yet a fully credible portfolio product until the scoring and feedback pipeline is made real and the app is documented as a focused MVP.

This README is now the source of truth for the exact steps needed to finish it properly.

---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sign-sensei-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7c6e4e9f-1297-4c74-8309-4107dd17d014).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
