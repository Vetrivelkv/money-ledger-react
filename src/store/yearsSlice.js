import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const fetchYears = createAsyncThunk("years/fetchYears", async () => {
  // NOTE: our fetch-based api wrapper returns parsed JSON directly,
  // not an axios-like { data } response.
  const data = await api.get("/years"); // cookie auth
  return data?.years || [];
});

export const createYear = createAsyncThunk(
  "years/createYear",
  async ({ year, months }, { rejectWithValue }) => {
    try {
      const data = await api.post("/years", { year, months }); // cookie auth
      // backend returns { year: {...} }
      return data?.year;
    } catch (err) {
      return rejectWithValue({
        message: err?.message || "Failed to create year",
        status: err?.status,
        data: err?.data,
      });
    }
  }
);

const yearsSlice = createSlice({
  name: "years",
  initialState: {
    list: [],
    selectedYear: null,
    loading: false,
    creating: false,
    error: null,
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
    builder
      .addCase(fetchYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYears.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.error?.message || "Failed to load years";
      })
      .addCase(createYear.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createYear.fulfilled, (state, action) => {
        state.creating = false;
        const created = action.payload;
        if (!created) return;

        // prevent duplicate by year
        const exists = state.list.some((y) => y.year === created.year);
        if (!exists) {
          state.list = [created, ...state.list].sort((a, b) => b.year - a.year);
        }
      })
      .addCase(createYear.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action?.payload?.message ||
          action?.error?.message ||
          "Failed to create year";
      });
  },
});

export const { selectYear, clearSelectedYear } = yearsSlice.actions;
export default yearsSlice.reducer;
