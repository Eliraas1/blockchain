import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import your reducers here
// import rootReducer from "./reducer";
import userSlice from "./slices/userSlice";
import showSlice from "./slices/showSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userSlice);
const combinedReducer = combineReducers({
  user: userSlice,
  showSlice,
});
// Create the store with persisted reducer
const store = configureStore({
  reducer: combinedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
