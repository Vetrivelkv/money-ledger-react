import { configureStore } from "@reduxjs/toolkit";
import yearsReducer from "./yearsSlice";
import uiReducer from "./uiSlice";

export default configureStore({
  reducer: {
    years: yearsReducer,
    ui: uiReducer,
  },
});
