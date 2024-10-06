// src/store/employeesSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import {EmployeeDetails, EmployeeListItem, UpdateEmployeeRequest} from '../types/employee';
import {parsePaginationHeader} from "../utils/pagination-utils.ts";
import axios from "axios";
import {FormError} from "../types/errors.ts";

export interface EmployeesState {
    employees: EmployeeListItem[];
    totalRecords: number | null;
    currentPage: number;
    pageSize: number;
    selectedEmployeeIds: string[];
    editEmployee: EmployeeDetails | null;
    error: string | null;
    deleteError: string | null;
    editError: string | null | FormError;
    isLoaded: boolean;
    deletePending: boolean;
    editPending: boolean;
    showDeleteModal: boolean;
    showEditModal: boolean;
}

const initialState: EmployeesState = {
    employees: [],
    totalRecords: null,
    currentPage: 0,
    pageSize: 5,
    selectedEmployeeIds: [],
    editEmployee: null,
    error: null,
    deleteError: null,
    editError: null,
    isLoaded: false,
    deletePending: false,
    editPending: false,
    showDeleteModal: false,
    showEditModal: false,
};

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async (_args, { getState,  }) => {
        const state = getState() as { employees: EmployeesState };
        const pageSize = state.employees.pageSize;
        const response = await axiosInstance.get<EmployeeListItem[]>(`/employees?page=1&pageSize=${pageSize}`);
        return { data: response.data, pagination: response.headers['x-pagination'] };
    }
);

export const fetchNextEmployees = createAsyncThunk(
    'employees/fetchNextEmployees',
    async (_args, { getState }) => {
        const state = getState() as { employees: EmployeesState };
        const currentPage = state.employees.currentPage;
        const pageSize = state.employees.pageSize;
        const page = currentPage + 1;
        const response = await axiosInstance.get<EmployeeListItem[]>(`/employees?page=${page}&pageSize=${pageSize}`);
        return { data: response.data, pagination: response.headers['x-pagination'] };
    }
);

export const deleteEmployees = createAsyncThunk(
    'employees/deleteEmployees',
    async (employeeIds: string[], { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/employees`, { data: {employeeIds} });
            return employeeIds;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.error ?? 'Unknown error');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

export const fetchEmployee = createAsyncThunk(
    'employees/fetchEmployee',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EmployeeDetails>(`/employees/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.error);
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/updateEmployee',
    async (employee: UpdateEmployeeRequest, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { employees: EmployeesState };
            if(state.employees.editEmployee === null) {
                await axiosInstance.post(`/employees`, employee);
            } else {
                await axiosInstance.patch(`/employees/${state.employees.editEmployee.id}`, employee);
            }
            return employee;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.error ?? 'Unknown error');
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setSelectedEmployeeIds: (state, action) => {
            state.selectedEmployeeIds = action.payload;
        },
        resetEmployees: (state) => {
            state.employees = [];
            state.totalRecords = null;
            state.selectedEmployeeIds = [];
            state.currentPage = 1;
            state.editEmployee = null;
        },
        setShowDeleteModal: (state, action) => {
            state.showDeleteModal = action.payload;
        },
        setShowEditModal: (state, action) => {
            state.showEditModal = action.payload;
        },
        clearEditEmployee: (state) => {
            state.editEmployee = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEmployees.fulfilled, (state, action) => {
            const paginationHeader = action.payload.pagination;
            if (paginationHeader) {
                const paginationData = parsePaginationHeader(paginationHeader);
                state.totalRecords = paginationData.totalCount;
            }
            state.employees = [...state.employees, ...action.payload.data];
            state.currentPage = 1;
            state.isLoaded = true;
        });
        builder.addCase(fetchEmployees.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch employees';
        });
        builder.addCase(fetchEmployees.pending, (state) => {
            state.isLoaded = false;
        });
        builder.addCase(fetchNextEmployees.fulfilled, (state, action) => {
            const paginationHeader = action.payload.pagination;
            if (paginationHeader) {
                const paginationData = parsePaginationHeader(paginationHeader);
                state.totalRecords = paginationData.totalCount;
            }
            state.employees = [...state.employees, ...action.payload.data];
            state.currentPage += 1;
        });
        builder.addCase(fetchNextEmployees.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch next employees';
        });
        builder.addCase(deleteEmployees.pending, (state) => {
            state.deletePending = true;
        });
        builder.addCase(deleteEmployees.fulfilled, (state) => {
            state.selectedEmployeeIds = [];
            state.deletePending = false;
        });
        builder.addCase(deleteEmployees.rejected, (state, action) => {
            state.deleteError = action.payload as string;
            state.deletePending = false;
        });
        builder.addCase(fetchEmployee.fulfilled, (state, action) => {
            state.editEmployee = action.payload;
        });
        builder.addCase(fetchEmployee.rejected, (state, action) => {
            state.error = action.payload as string;
        });
        builder.addCase(updateEmployee.pending, (state) => {
            state.editPending = true;
        });
        builder.addCase(updateEmployee.fulfilled, (state) => {
            state.editEmployee = null;
            state.editPending = false;
        });
        builder.addCase(updateEmployee.rejected, (state, action) => {
            state.editError = action.payload as string | FormError;
            state.editPending = false;
        });
    },
});

export const { setSelectedEmployeeIds, resetEmployees, setShowDeleteModal, setShowEditModal, clearEditEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;