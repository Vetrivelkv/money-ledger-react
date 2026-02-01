import { configureStore } from "@reduxjs/toolkit";
import yearsReducer from "./yearsSlice";
import uiReducer from "./uiSlice";
import balancesReducer from "./balancesSlice";

export default configureStore({
  reducer: {
    years: yearsReducer,
    ui: uiReducer,
    balances: balancesReducer,
  },
});
