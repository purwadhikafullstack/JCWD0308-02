import { getAddresstById } from '@/lib/fetch-api/address';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserAddressType {
  id: string;
  userId: string;
  isMainAddress: boolean;
  address: string;
  cityId: number;
  note?: string | null;
  coordinate: string;
  updatedAt: Date;
  createdAt: Date;
}
export interface AddressResponse {
  data: UserAddressType[];
}

interface AddressSlice {
  addresses: UserAddressType[];
  selectedAddressId: string | null;
  error: string | null;
}

const initialState: AddressSlice = {
  addresses: [],
  selectedAddressId: null,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = getAddresstById();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddressId: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<UserAddressType[]>) => {
          state.addresses = action.payload;
          state.error = null;
        },
      )
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAddressId } = addressSlice.actions;
export const selectAddresses = (state: RootState) => state.address.addresses;
export const selectSelectedAddressId = (state: RootState) =>
  state.address.selectedAddressId;
export default addressSlice.reducer;
