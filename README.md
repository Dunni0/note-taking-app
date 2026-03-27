# Note Taking App 🗒️

Your thoughts, organised. Write, tag, search, and archive your notes — all in one place.

**Live demo → [note-taking-app-two-beta.vercel.app](https://note-taking-app-two-beta.vercel.app)**

---

## What you can do

- 🔐 **Sign in securely** — your notes are private to you, always
- ✏️ **Write freely** — create, edit, and delete notes without friction
- 🏷️ **Stay organised with tags** — attach multiple tags to any note and filter by them instantly
- 🔍 **Find anything fast** — search across titles, content, and tags at once
- 🗄️ **Archive instead of delete** — tuck notes away without losing them permanently, restore anytime
- 🛡️ **No accidental deletions** — confirmation modals on every destructive action

---

## Install as an app

Note Taking App works as a Progressive Web App (PWA) — save it to your device and use it like a native app, no app store needed.

**On desktop (Chrome / Edge):**
1. Open the live demo in Chrome or Edge
2. Look for the install icon (⊕) in the address bar on the right
3. Click **Install**

**On Android (Chrome):**
1. Open the live demo in Chrome
2. Tap the three-dot menu (⋮) in the top right
3. Tap **Add to Home screen** → **Add**

**On iOS (Safari):**
1. Open the live demo in Safari
2. Tap the share icon (□↑) at the bottom
3. Tap **Add to Home Screen** → **Add**

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 13+ (App Router), React, Tailwind CSS, React Icons |
| State | Redux Toolkit |
| Auth | NextAuth.js |
| Backend | Next.js API Routes |
| Database | MongoDB · Mongoose |

---

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB URI (local or Atlas)

### Setup
```bash
git clone https://github.com/Dunni0/note-taking-app.git
cd note-taking-app
npm install
```

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<your-connection-string>
NEXTAUTH_SECRET=your_secret_here
```

Then start the dev server:
```bash
npm run dev
```

App runs at `http://localhost:3000`.

---

## API routes

All note operations go through `/api/notes`:

| Method | Description |
|---|---|
| `GET` | Fetch all notes (supports `?search=` query) |
| `POST` | Create a new note |
| `PUT` | Update an existing note |
| `PATCH` | Archive or restore a note |
| `DELETE` | Delete a note |

---

## Project structure
```
note-taking-app/
├── lib/                    # MongoDB connection
├── models/                 # Mongoose schemas (Notes, Users)
├── src/
│   ├── app/
│   │   ├── api/            # API routes (auth, notes, register)
│   │   ├── home/           # Main app page
│   │   └── login/          # Auth page
│   ├── components/         # UI components (Sidebar, TopNav, Body...)
│   ├── modals/             # Confirm modal
│   ├── providers/          # Redux + session providers
│   └── store/              # Redux slices (notes, modal state)
└── public/
```

---

## Author

Made by **Pelumi Awonuga** — [LinkedIn](https://www.linkedin.com/in/oluwapelumi-awonuga-841997221) · [pelumioladunni3@gmail.com](mailto:pelumioladunni3@gmail.com)
