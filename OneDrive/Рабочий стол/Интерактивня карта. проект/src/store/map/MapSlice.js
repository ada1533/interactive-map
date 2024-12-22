// mapSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getName } from './MapActions';

const initialState = {
    markerItem: null,
    geoLocation: null,
    status: 'idle',
    error: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setMarkerPosition: (state, action) => {
            // if (!state.markerItem) {
                    state.markerItem = { position: action.payload, name: '' };
                // } else {
                    // state.markerItem.position = action.payload;
                // }
        },
        setGeoLocation: (state, action) => {
            state.geoPosition = { position: action.payload.position, name: action.payload.name };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (state.markerItem) {
                    state.markerItem.name = action.payload;
                }
            })
            .addCase(getName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setMarkerPosition, setGeoLocation } = mapSlice.actions;
export default mapSlice.reducer;
