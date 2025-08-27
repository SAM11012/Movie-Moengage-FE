import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./store/userSlice";
import movieReducer from "./store/movieSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "movie"],
};

import { combineReducers } from "@reduxjs/toolkit";
const rootReducer = combineReducers({
  user: userReducer,
  movie: movieReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Optional: add middleware for redux-persist if needed
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
