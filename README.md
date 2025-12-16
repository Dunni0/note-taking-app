# Note Taking App

A full-stack Next.js note-taking application backed by MongoDB.
The app supports authentication, note CRUD operations, tags, search, archiving, and centralized state management.

---

## Tech Stack

### Frontend

* Next.js 13+ (App Router)
* React (Client Components)
* Redux Toolkit
* NextAuth
* Tailwind CSS
* React Icons

### Backend

* Next.js API Routes
* MongoDB
* Mongoose

---

## Features

* User authentication (login, register, logout)
* Create, update, delete notes
* Archive and restore notes
* Tag support (multiple tags per note)
* Search by title, content, and tags
* Confirmation modal for destructive actions
* Centralized API service layer
* Predictable global state management with Redux

---

## Folder Structure

note-taking-app/
├── lib/
│   └── mongodb.js
│
├── models/
│   ├── Notes.js
│   └── Users.js
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── notes/
│   │   │   │   └── route.js
│   │   │   └── register/
│   │   │
│   │   ├── home/
│   │   │   └── page.jsx
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── layout.jsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── Body.jsx
│   │   ├── NoteActions.jsx
│   │   ├── SideBar.jsx
│   │   ├── TopNav.jsx
│   │   └── SessionWrapper.jsx
│   │
│   ├── modals/
│   │   └── ConfirmModal.jsx
│   │
│   ├── providers/
│   │   ├── ReduxProvider.jsx
│   │   └── QueryProvider.jsx
│   │
│   ├── store/
│   │   ├── notes/
│   │   │   └── index.js
│   │   ├── modals/
│   │   │   └── ConfirmModalSlice.js
│   │   └── store.js
│   │
│   └── assets/
│
├── public/
├── .env.local
├── package.json
└── next.config.js

---

## Notes Data Model

Note

* _id: ObjectId
* title: string
* note: string
* tag: string[]
* archived: boolean
* userId: ObjectId
* createdAt: Date
* updatedAt: Date

---

## API Design

All note operations are handled via:

/api/notes

### Supported Methods

* GET – Fetch notes (supports search query)
* POST – Create a new note
* PUT – Update an existing note
* PATCH – Archive or restore a note
* DELETE – Delete a note

Search example:

GET /api/notes?search=meeting

---

## Notes Service Layer

Client-side API calls are centralized in:

src/store/notes/index.js

### Exposed Functions

* getAllNotes(query)
* createNote(noteData)
* updateNote(noteData)
* deleteNote(id)
* updateNoteArchiveStatus(id, archived)

UI components do not call fetch directly.

---

## State Management

### Notes

* Managed globally using Redux Toolkit
* Refreshed after create, update, delete, and archive actions

### Confirm Modal

Slice location:
src/store/modals/ConfirmModalSlice.js

State shape:

* open: boolean
* type: delete | archive | restore | logout
* noteId: string | null

Used to prevent accidental destructive actions.

---

## Search and Tags

* Client-side search
* Debounced input
* Matches note title, content, and tags

---

## Environment Variables

Create a .env.local file:

NEXT_PUBLIC_API_BASE_URL=[http://localhost:3000](http://localhost:3000)
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your_secret

---

## Running the Project

npm install
npm run dev

Application runs at:

[http://localhost:3000](http://localhost:3000)

---

## Limitations

* Search is not indexed (no MongoDB text index yet)
* No offline support
* No note version history

---

## Future Improvements

* MongoDB text indexes
* Server-side pagination
* Tag management
* Autosave drafts
* Rich text editor
* Dark mode

---

## License

MIT

---
