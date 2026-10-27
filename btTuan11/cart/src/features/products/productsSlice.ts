import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const USD_TO_VND = 25_000;

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        return rejectWithValue(`Không thể tải sản phẩm (HTTP ${response.status}).`);
      }
      const data = (await response.json()) as Product[];
      return data.map(({ id, title, price, image }) => ({
        id,
        title,
        price: Math.round(price * USD_TO_VND),
        image,
      }));
    } catch {
      return rejectWithValue('Không thể kết nối đến máy chủ sản phẩm.');
    }
  },
);

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã xảy ra lỗi không xác định.';
      });
  },
});

export default productsSlice.reducer;
