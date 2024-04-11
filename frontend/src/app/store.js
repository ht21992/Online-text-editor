import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import documentSlice from "../slices/documentSlice";
import versionSlice from "../slices/versionSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    document:documentSlice,
    version : versionSlice
  },
});

export default store;