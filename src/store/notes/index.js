// lib/api.js or services/notes.js

// Generic request helper
const request = async (url, options) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return res.json().catch(() => null);
};

// Fetch all notes
export const getAllNotes = async (query = "") => {
  const url = query
    ? `/api/notes?search=${encodeURIComponent(query)}`
    : `/api/notes`;

  const data = await request(url, { cache: "no-store" });
  return Array.isArray(data?.getNotes) ? data.getNotes : [];
};

// Create a new note
export const createNote = async (noteData) => {
  return request(`/api/notes`, {
    method: "POST",
    body: JSON.stringify(noteData),
  });
};

// Update an existing note
export const updateNote = async (noteData) => {
  return request(`/api/notes`, {
    method: "PUT",
    body: JSON.stringify(noteData),
  });
};

// Delete note
export const deleteNote = async (id) => {
  return request(`/api/notes`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
};

// Archive / restore note
export const updateNoteArchiveStatus = async (id, archived) => {
  return request(`/api/notes`, {
    method: "PATCH",
    body: JSON.stringify({ id, archived }),
  });
};
