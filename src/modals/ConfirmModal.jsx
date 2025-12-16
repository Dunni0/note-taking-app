"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeConfirmModal } from "@/store/modals/ConfirmModalSlice";
import {
  ArchiveBoxArrowDownIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { deleteNote, updateNoteArchiveStatus } from "@/store/notes";

export const ConfirmModal = ({ refreshNotes, onActionComplete }) => {
  const dispatch = useDispatch();
  const { open, type, noteId } = useSelector((state) => state.confirmModal);

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (type === "delete") {
        await deleteNote(noteId);
      }

      if (type === "archive") {
        await updateNoteArchiveStatus(noteId, true);
      }

      if (type === "restore") {
        await updateNoteArchiveStatus(noteId, false);
      }

      if (type === "logout") {
        await signOut({ callbackUrl: "/login" });
        return;
      }

      onActionComplete?.();
      refreshNotes?.();
    } catch (err) {
      console.error("Confirm action failed:", err);
    } finally {
      setLoading(false);
      dispatch(closeConfirmModal());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[400px] md:w-[500px]">
        <div className="flex align-top gap-3">
          <div>
            {type === "delete" ? (
              <TrashIcon className="w-8 h-8 stroke-2 stroke-neutral-700" />
            ) : type === "archive" ? (
              <ArchiveBoxArrowDownIcon className="w-8 h-8 stroke-2 stroke-neutral-700" />
            ) : type === "restore" ? (
              <ArrowPathIcon className="w-8 h-8 stroke-2 stroke-neutral-700" />
            ) : (
              <ArrowLeftEndOnRectangleIcon className="w-8 h-8 stroke-2 stroke-neutral-700" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">
              {type === "delete"
                ? "Delete Note"
                : type === "archive"
                ? "Archive Note"
                : type === "restore"
                ? "Restore Note"
                : "Logout"}
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              {type === "delete"
                ? "Are you sure you want to permanently delete this note? This action cannot be undone."
                : type === "archive"
                ? "Are you sure you want to archive this note? You can find it later in the Archived Notes section and restore it anytime."
                : type === "restore"
                ? "Are you sure you want to restore this note?"
                : "Are you sure you want to logout of your account?"}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t-[1px] border-gray-200 pt-4">
          <button
            onClick={() => dispatch(closeConfirmModal())}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded text-white flex items-center gap-2
    ${
      type === "delete"
        ? "bg-red-600 hover:bg-red-500"
        : "bg-blue-600 hover:bg-blue-500"
    }
    ${loading ? "opacity-70 cursor-not-allowed" : ""}
  `}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                />
              </svg>
            )}
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
