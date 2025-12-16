// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import confirmModalReducer from "./modals/ConfirmModalSlice";

export const store = configureStore({
  reducer: {
    confirmModal: confirmModalReducer,
  },
});
