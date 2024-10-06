import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {EmployeeListItem} from "../types/employee.ts";

const fetchNextEmployeesQuery = (
    args: {starting: boolean},
    { signal, dispatch, getState },
    extraOptions,
    baseQuery) =>
{
    const { starting } = args;
    const state = getState();
}

export const employeesApi = createApi({
    reducerPath: 'employeesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5012/api' }),
    endpoints: (builder) => ({
        fetchEmployees: builder.query<EmployeeListItem[], { starting: boolean }>({
            query: ({}) => `/employees?page=${pageNo}&pageSize=${pageSize}`,
            serializeQueryArgs: ({endpointName}) => endpointName,
            merge: (currentCache, newItems) => [...currentCache, ...newItems],
            forceRefetch: ({ currentArg, previousArg}) => currentArg !== previousArg,
        })
    })
})

export const { useFetchEmployees } = employeesApi;
