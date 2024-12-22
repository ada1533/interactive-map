import { configureStore } from "@reduxjs/toolkit";
import MapSlice from "./map/MapSlice";
export const store = configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    }),
    reducer: {
        map: MapSlice
    }
});
