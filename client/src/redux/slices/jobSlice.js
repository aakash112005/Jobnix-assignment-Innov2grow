import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '../../services/jobService';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try {
    return await jobService.getJobs(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load jobs');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 9, total: 0, pages: 0 },
    filters: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = jobSlice.actions;
export default jobSlice.reducer;
