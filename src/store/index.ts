// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './employeesSlice';
import sexReducer from './sexSlice';

const store = configureStore({
    reducer: {
        employees: employeesReducer,
        sex: sexReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
