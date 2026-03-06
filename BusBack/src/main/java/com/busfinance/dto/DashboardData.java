package com.busfinance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardData {
    private DashboardSummary summary;
    private List<ChartDataPoint> monthlyIncome;
    private List<MonthlyTrend> financialTrends;
}
