// store/confirmModalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  type: null,  
  noteId: null,
};

const confirmModalSlice = createSlice({
  name: "confirmModal",
  initialState,
  reducers: {
    openConfirmModal: (state, action) => {
      state.open = true;
      state.type = action.payload.type;
      state.noteId = action.payload.noteId;
    },
    closeConfirmModal: (state) => {
      state.open = false;
      state.type = null;
      state.noteId = null;
    },
  },
});

export const { openConfirmModal, closeConfirmModal } = confirmModalSlice.actions;
export default confirmModalSlice.reducer;
