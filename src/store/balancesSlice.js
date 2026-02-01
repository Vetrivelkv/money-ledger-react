import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";

// Fetch ALL balances (across all years/months)
export const fetchAllBalances = createAsyncThunk(
  "balances/fetchAllBalances",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/balances");
      return data?.balances || [];
    } catch (err) {
      return rejectWithValue({
        message: err?.message || "Failed to load balances",
        status: err?.status,
        data: err?.data,
      });
    }
  }
);

// Fetch user transactions across ALL balances
export const fetchUserTransactions = createAsyncThunk(
  "balances/fetchUserTransactions",
  async ({ limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const data = await api.get(`/balances/transactions?limit=${limit}`);
      return data?.transactions || [];
    } catch (err) {
      return rejectWithValue({
        message: err?.message || "Failed to load transactions",
        status: err?.status,
        data: err?.data,
      });
    }
  }
);

const balancesSlice = createSlice({
  name: "balances",
  initialState: {
    list: [],
    totalCurrentBalance: 0,

    recentTransactions: [],
    allTransactions: [],

    loadingBalances: false,
    loadingRecent: false,
    loadingAll: false,
    error: null,
  },
  reducers: {
    clearAllTransactions(state) {
      state.allTransactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBalances.pending, (state) => {
        state.loadingBalances = true;
        state.error = null;
      })
      .addCase(fetchAllBalances.fulfilled, (state, action) => {
        state.loadingBalances = false;
        state.list = action.payload || [];
        state.totalCurrentBalance = (state.list || []).reduce(
          (sum, b) => sum + Number(b?.currentBalance || 0),
          0
        );
      })
      .addCase(fetchAllBalances.rejected, (state, action) => {
        state.loadingBalances = false;
        state.error =
          action?.payload?.message ||
          action?.error?.message ||
          "Failed to load balances";
      })
      .addCase(fetchUserTransactions.pending, (state, action) => {
        const limit = action.meta?.arg?.limit ?? 10;
        if (limit === 0) state.loadingAll = true;
        else state.loadingRecent = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        const limit = action.meta?.arg?.limit ?? 10;
        const rows = (action.payload || []).slice();

        // Always ensure newest first
        rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (limit === 0) {
          state.loadingAll = false;
          state.allTransactions = rows;
        } else {
          state.loadingRecent = false;
          state.recentTransactions = rows.slice(0, limit);
        }
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        const limit = action.meta?.arg?.limit ?? 10;
        if (limit === 0) state.loadingAll = false;
        else state.loadingRecent = false;
        state.error =
          action?.payload?.message ||
          action?.error?.message ||
          "Failed to load transactions";
      });
  },
});

export const { clearAllTransactions } = balancesSlice.actions;
export default balancesSlice.reducer;
