# Note Taking App 🗒️

A full-stack note-taking app built with Next.js and MongoDB. Write, organise, search, tag, and archive your notes — all behind a secure authentication layer.

**Live demo → [note-taking-app-two-beta.vercel.app](https://note-taking-app-two-beta.vercel.app)**

---

## Features

- 🔐 **Authentication** — register, login, and logout securely via NextAuth
- ✏️ **Full CRUD** — create, edit, and delete notes
- 🗄️ **Archive & restore** — keep things tidy without losing anything permanently
- 🏷️ **Tags** — attach multiple tags to any note for better organisation
- 🔍 **Search** — find notes instantly by title, content, or tag
- 🛡️ **Confirmation modals** — no accidental deletes
- 🗃️ **Redux state management** — predictable, centralised global state

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
