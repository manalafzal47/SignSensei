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

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
