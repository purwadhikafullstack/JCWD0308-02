import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

export default store;
