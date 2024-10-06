import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {EmployeeListItem} from "../types/employee.ts";

export const employeesApi = createApi({
    reducerPath: 'employeesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5012/api' }),
    endpoints: (builder) => ({
        fetchEmployees: builder.query<EmployeeListItem[], { pageNo: number, pageSize: number }>({
            query: ({pageNo, pageSize}) => `/employees?page=${pageNo}&pageSize=${pageSize}`,
            serializeQueryArgs: ({endpointName}) => endpointName,
            merge: (currentCache, newItems) => [...currentCache, ...newItems],
            forceRefetch: ({ currentArg, previousArg}) => currentArg !== previousArg,
        })
    })
})

export const { useFetchEmployees,  } = employeesApi;
