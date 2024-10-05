export interface EmployeeListItem {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    sex: string;
}

export interface Sex {
    id: number;
    name: string;
}

export interface EmployeeDetails {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    sex: Sex;
}