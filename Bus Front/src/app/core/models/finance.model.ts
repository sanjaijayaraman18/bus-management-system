import { Route } from "../services/route.service";

export interface DailyFinance {
    id?: number;
    date: string;
    driverName: string;
    conductorName: string;
    cleanerName: string;
    driverSalaryPaid: number;
    conductorSalaryPaid: number;
    driverBalanceSalary?: number;
    conductorBalanceSalary?: number;
    cleanerBalanceSalary?: number;
    dieselLiters: number;
    dieselPricePerLiter: number;
    dieselExpense: number;
    totalCollection: number;
    cleanerPadi: number;
    unionFee: number;
    pooSelavu: number;
    balance?: number;
    route?: Route;
}

