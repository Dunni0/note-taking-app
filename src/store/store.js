// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import confirmModalReducer from "./ConfirmModalSlice";

export const store = configureStore({
  reducer: {
    confirmModal: confirmModalReducer,
  },
});
