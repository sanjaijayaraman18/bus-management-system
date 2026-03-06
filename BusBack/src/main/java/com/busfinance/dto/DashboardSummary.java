package com.busfinance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private Double todayCollection;
    private Double todayDiesel;
    private Double todaySalary;
    private Double netBalance;
}
