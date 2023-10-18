import { mainReducer } from "./Reducers";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
});
