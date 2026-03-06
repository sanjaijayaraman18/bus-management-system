export interface Driver {
    id?: number;
    name: string;
    mobileNumber: string;
    age: number;
}

export interface Conductor {
    id?: number;
    name: string;
    mobileNumber: string;
    age: number;
}

export interface StaffMember {
    id?: number;
    name: string;
    mobileNumber: string;
    age: number;
    role: 'Driver' | 'Conductor';
    totalBalance: number;
}
