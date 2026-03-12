export interface StaffMember {
    id?: number;
    name: string;
    mobileNumber: string;
    licenseNumber?: string;
    employeeId?: string;
    aadharNumber?: string;
    role: 'Driver' | 'Conductor' | 'Cleaner';
    age: number;
    totalBalance: number;
    walletBalance?: number; // Adjustment/Starting
    fixedSalary?: number;
    assignedRoute?: any;
}

export interface Driver extends StaffMember {
    role: 'Driver';
}

export interface Conductor extends StaffMember {
    role: 'Conductor';
}

export interface Cleaner extends StaffMember {
    role: 'Cleaner';
}
