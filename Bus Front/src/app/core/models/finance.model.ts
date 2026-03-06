export interface DailyFinance {
    id?: number;
    date: string;
    driverName: string;
    conductorName: string;
    driverSalaryPaid: number;
    conductorSalaryPaid: number;
    driverBalanceSalary?: number;
    conductorBalanceSalary?: number;
    dieselLiters: number;
    dieselPricePerLiter: number;
    totalCollection: number;
    balance?: number;
    includeUnionFees?: boolean;
    includePooSelavu?: boolean;
    cleanerPadi: number;
}
