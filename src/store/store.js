// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import confirmModalReducer from "./modals/ConfirmModalSlice";
import themeReducer from "./theme/themeSlice";

export const store = configureStore({
  reducer: {
    confirmModal: confirmModalReducer,
    theme: themeReducer,
  },
});
