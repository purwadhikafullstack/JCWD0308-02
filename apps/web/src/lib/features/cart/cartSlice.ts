import { deleteCart, getCart, updateCart, addCart, getCartItemCount } from '@/lib/fetch-api/cart';
import { CartItemType } from '@/lib/types/cart';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartSlice {
  items: CartItemType[];
  itemCount: number;
  error: any | null;
}

const initialState: CartSlice = {
  items: [],
  itemCount: 0,
  error: null,
};

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async (cartId: any, { rejectWithValue }) => {
  try {
    const res = await deleteCart(cartId);
    return cartId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, stockId, quantity }: { cartItemId: string; stockId: string; quantity: number }, { rejectWithValue }) => {
  try {
    const res = await updateCart(cartItemId, stockId, quantity);
    return res;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const addCartItem = createAsyncThunk('cart/addToCart', async ({ stockId, quantity, isPack }: { stockId: string; quantity: number; isPack: boolean }, { rejectWithValue, dispatch }) => {
  try {
    const response = await addCart(stockId, quantity, isPack);
    dispatch(fetchCartItemCount());
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchCartItemCount = createAsyncThunk('cart/fetchCartItemCount', async (_, { rejectWithValue }) => {
  try {
    const response = await getCartItemCount();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await getCart();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const removeSelectedItems = createAsyncThunk('cart/removeSelectedItems', async (selectedItemIds: string[], { getState }) => {
  const state = getState() as { cart: CartSlice };
  const remainingItems = state.cart.items.filter((item) => !selectedItemIds.includes(`${item.id}-${item.isPack}`));
  return remainingItems;
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemType>) => {
      state.items.push(action.payload);
    },
    updateQuantity: (state, action: PayloadAction<Partial<CartItemType>>) => {
      const { id, ...updates } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        Object.assign(existingItem, updates);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCart: (state, action: PayloadAction<CartItemType[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    setItemCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    //delete
    builder
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //update
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex((item) => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //getitemcount
      .addCase(fetchCartItemCount.fulfilled, (state, action) => {
        state.itemCount = action.payload;
        state.error = null;
      })
      .addCase(fetchCartItemCount.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //get
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //remove selected items
      .addCase(removeSelectedItems.fulfilled, (state, action: PayloadAction<CartItemType[]>) => {
        state.items = action.payload;
        state.itemCount = action.payload.length;
      });
  },
});
export const { setCart, addToCart, updateQuantity, setItemCount, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
