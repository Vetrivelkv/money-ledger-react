import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../services/api"; // use your existing axios wrapper

export const fetchYears = createAsyncThunk("years/fetchYears", async () => {
  const res = await api.get("/years"); // cookie auth
  console.log(res, "Res log");
  return res.data;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchYears.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { selectYear } = yearsSlice.actions;
export default yearsSlice.reducer;
