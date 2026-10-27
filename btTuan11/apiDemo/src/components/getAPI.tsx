import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const toursApiUrl = 'https://6acdca04f338359cf1c25441.mockapi.io/tours';

export type Tour = {
  id: string;
  name?: string;
  title?: string;
  price?: string | number;
};

type TourState = {
  data: Tour[];
  loading: boolean;
  adding: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
};

export const fetchTourData = createAsyncThunk<Tour[]>('tour/fetchTourData', async () => {
  const response = await fetch(toursApiUrl);

  if (!response.ok) {
    throw new Error(`Không thể tải danh sách tour (${response.status})`);
  }

  return (await response.json()) as Tour[];
});

export const addTourData = createAsyncThunk<Tour, { name: string; price: number }>(
  'tour/addTourData',
  async (tour) => {
    const response = await fetch(toursApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tour),
    });

    if (!response.ok) {
      throw new Error(`Không thể lưu tour (${response.status})`);
    }

    return (await response.json()) as Tour;
  }
);

export const updateTourData = createAsyncThunk<
  Tour,
  { id: string; name: string; price: number }
>('tour/updateTourData', async ({ id, ...tour }) => {
  const response = await fetch(`${toursApiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tour),
  });

  if (!response.ok) {
    throw new Error(`Không thể cập nhật tour (${response.status})`);
  }

  return (await response.json()) as Tour;
});

export const deleteTourData = createAsyncThunk<string, string>(
  'tour/deleteTourData',
  async (tourId) => {
    const response = await fetch(
      `${toursApiUrl}/${encodeURIComponent(String(tourId))}`,
      {
      method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Không thể xóa tour (${response.status})`
      );
    }

    return String(tourId);
  }
);

const initialState: TourState = {
  data: [],
  loading: false,
  adding: false,
  updating: false,
  deleting: false,
  error: null,
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTourData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTourData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Đã xảy ra lỗi khi tải tour';
      })
      .addCase(addTourData.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addTourData.fulfilled, (state, action) => {
        state.adding = false;
        state.data = [action.payload, ...state.data];
      })
      .addCase(addTourData.rejected, (state, action) => {
        state.adding = false;
        state.error = action.error.message ?? 'Không thể lưu tour';
      })
      .addCase(updateTourData.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTourData.fulfilled, (state, action) => {
        state.updating = false;
        state.data = state.data.map((tour) =>
          tour.id === action.payload.id ? action.payload : tour
        );
      })
      .addCase(updateTourData.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message ?? 'Không thể cập nhật tour';
      })
      .addCase(deleteTourData.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTourData.fulfilled, (state, action) => {
        state.deleting = false;
        state.data = state.data.filter(
          (tour) => String(tour.id) !== String(action.payload)
        );
      })
      .addCase(deleteTourData.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message ?? 'Không thể xóa tour';
      });
  },
});

export default tourSlice.reducer;
