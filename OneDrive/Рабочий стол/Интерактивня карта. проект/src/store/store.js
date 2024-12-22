import { configureStore } from "@reduxjs/toolkit";
import MapSlice from "./map/MapSlice";
export const store = configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false  // отключена сериализация
    }),
    reducer: {
        map: MapSlice
    }
});
