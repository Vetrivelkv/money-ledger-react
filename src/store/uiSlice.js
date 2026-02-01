import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    view: "YEARS",
    selectedMonth: null,
  },
  reducers: {
    setView(state, action) {
      state.view = action.payload;
    },
    setSelectedMonth(state, action) {
      state.selectedMonth = action.payload;
    },
    clearSelectedMonth(state) {
      state.selectedMonth = null;
    },
  },
});

export const { setView, setSelectedMonth, clearSelectedMonth } = uiSlice.actions;
export default uiSlice.reducer;
