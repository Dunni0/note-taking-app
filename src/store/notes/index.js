const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// Fetch notes
export const getAllNotes = async (query = "") => {
  const url = query
    ? `${BASE_URL}/api/notes?search=${encodeURIComponent(query)}`
    : `${BASE_URL}/api/notes`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch notes");

  const data = await res.json();
  return data?.getNotes || [];
};

// Create a new note
export const createNote = async (noteData) => {
  return request(`${BASE_URL}/api/notes`, {
    method: "POST",
    body: JSON.stringify(noteData),
  });
};

// Update an existing note
export const updateNote = async (noteData) => {
  return request(`${BASE_URL}/api/notes`, {
    method: "PUT",
    body: JSON.stringify(noteData),
  });
};

// Delete note
export const deleteNote = async (id) => {
  return request(`${BASE_URL}/api/notes`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
};

// Archive / restore note
export const updateNoteArchiveStatus = async (id, archived) => {
  return request(`${BASE_URL}/api/notes`, {
    method: "PATCH",
    body: JSON.stringify({ id, archived }),
  });
};
