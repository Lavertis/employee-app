export interface EmployeeListItem {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    sex: string;
}

export interface Sex {
    id: string;
    name: string;
}

export interface EmployeeDetails {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    sex: Sex;
}

export interface UpdateEmployeeRequest {
    firstName?: string;
    lastName?: string;
    age?: number;
    sexId?: string;
}