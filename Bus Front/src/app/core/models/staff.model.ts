export interface StaffMember {
    id?: number;
    name: string;
    mobileNumber: string;
    licenseNumber?: string;
    employeeId?: string;
    aadharNumber?: string;
    role: 'Driver' | 'Conductor' | 'Cleaner';
    age: number;   // ✅ ADD THIS
    totalBalance: number;
    walletBalance?: number;
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
