import { PaginationMetadata } from "../types/pagination.ts";

export const parsePaginationHeader = (header: string): PaginationMetadata => {
    const data = header.split(',').reduce((acc: any, item: string) => {
        const [key, value] = item.split('=');
        acc[key.trim()] = parseInt(value.trim(), 10);
        return acc;
    }, {});

    return {
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages
    };
};
