export interface DashboardSummary {
    todayCollection: number;
    todayDiesel: number;
    todaySalary: number;
    netBalance: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface MonthlyTrend {
    month: string;
    income: number;
    expense: number;
}

export interface DashboardData {
    summary: DashboardSummary;
    monthlyIncome: ChartDataPoint[];
    financialTrends: MonthlyTrend[];
}
