import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const fetchYears = createAsyncThunk("years/fetchYears", async () => {
  // NOTE: our fetch-based api wrapper returns parsed JSON directly,
  // not an axios-like { data } response.
  const data = await api.get("/years"); // cookie auth
  console.log(data, "Years data");
  return data?.years;
});

const yearsSlice = createSlice({
  name: "years",
  initialState: {
    list: [],
    selectedYear: null,
  },
  reducers: {
    selectYear(state, action) {
      state.selectedYear = action.payload;
    },
    clearSelectedYear(state) {
      state.selectedYear = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchYears.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { selectYear, clearSelectedYear } = yearsSlice.actions;
export default yearsSlice.reducer;
