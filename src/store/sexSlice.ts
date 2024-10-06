// src/store/sexSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { Sex } from '../types/employee';
import {sexLabels} from "../constants/enum-labels.ts";

export interface SexState {
    sexOptions: { value: number; label: string }[];
    error: string | null;
}

const initialState: SexState = {
    sexOptions: [],
    error: null,
};

export const fetchSexes = createAsyncThunk('sex/fetchSexes', async () => {
    const response = await axiosInstance.get<Sex[]>('/sexes');
    return response.data;
});

const sexSlice = createSlice({
    name: 'sex',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSexes.fulfilled, (state, action) => {
            state.sexOptions = action.payload.map((sex: Sex) => ({
                value: sex.id,
                label: sexLabels[sex.name as keyof typeof sexLabels],
            }));
        });
        builder.addCase(fetchSexes.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch sexes';
        });
    },
});

export default sexSlice.reducer;