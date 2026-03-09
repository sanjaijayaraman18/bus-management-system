package com.busfinance.service.impl;

import com.busfinance.dto.ChartDataPoint;
import com.busfinance.dto.DashboardData;
import com.busfinance.dto.DashboardSummary;
import com.busfinance.dto.MonthlyTrend;
import com.busfinance.entity.DailyFinance;
import com.busfinance.repository.DailyFinanceRepository;
import com.busfinance.security.SecurityUtils;
import com.busfinance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DailyFinanceRepository dailyFinanceRepository;
    private final SecurityUtils securityUtils;

    @Override
    public DashboardData getDashboardData() {
        List<DailyFinance> allFinance = getFilteredFinance();
        DashboardSummary summary = calculateSummary(allFinance);
        List<ChartDataPoint> monthlyIncome = calculateMonthlyIncome(allFinance);
        List<MonthlyTrend> financialTrends = calculateFinancialTrends(allFinance);

        return new DashboardData(summary, monthlyIncome, financialTrends);
    }

    @Override
    public DashboardSummary getSummary() {
        List<DailyFinance> allFinance = getFilteredFinance();
        return calculateSummary(allFinance);
    }

    private List<DailyFinance> getFilteredFinance() {
        if (securityUtils.isAdmin()) {
            return dailyFinanceRepository.findAll();
        }
        return dailyFinanceRepository.findByOwner(securityUtils.getCurrentUser());
    }

    private DashboardSummary calculateSummary(List<DailyFinance> records) {
        LocalDate today = LocalDate.now();
        List<DailyFinance> todayRecords = records.stream()
                .filter(r -> r.getDate().equals(today))
                .collect(Collectors.toList());

        double todayCollection = todayRecords.stream().mapToDouble(r -> safeDouble(r.getTotalCollection())).sum();
        double todayDiesel = todayRecords.stream().mapToDouble(r -> safeDouble(r.getDieselExpense())).sum();
        double todaySalary = todayRecords.stream().mapToDouble(r -> safeDouble(r.getDriverSalaryPaid()) + safeDouble(r.getConductorSalaryPaid())).sum();
        double netBalance = todayRecords.stream().mapToDouble(r -> safeDouble(r.getBalance())).sum();

        return new DashboardSummary(todayCollection, todayDiesel, todaySalary, netBalance);
    }

    private List<ChartDataPoint> calculateMonthlyIncome(List<DailyFinance> records) {
        Map<String, Double> monthlyMap = new LinkedHashMap<>();
        
        // Group by Month-Year
        for (DailyFinance record : records) {
            String monthName = record.getDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyMap.put(monthName, monthlyMap.getOrDefault(monthName, 0.0) + safeDouble(record.getTotalCollection()));
        }

        return monthlyMap.entrySet().stream()
                .map(e -> new ChartDataPoint(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    private List<MonthlyTrend> calculateFinancialTrends(List<DailyFinance> records) {
        Map<String, MonthlyTrend> trendMap = new LinkedHashMap<>();

        for (DailyFinance record : records) {
            String monthName = record.getDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            MonthlyTrend trend = trendMap.getOrDefault(monthName, new MonthlyTrend(monthName, 0.0, 0.0));
            
            double income = safeDouble(record.getTotalCollection());
            double expense = safeDouble(record.getDieselExpense()) 
                            + safeDouble(record.getDriverSalaryPaid()) 
                            + safeDouble(record.getConductorSalaryPaid())
                            + safeDouble(record.getCleanerPadi())
                            + safeDouble(record.getUnionFee())
                            + safeDouble(record.getPooSelavu());

            trend.setIncome(trend.getIncome() + income);
            trend.setExpense(trend.getExpense() + expense);
            trendMap.put(monthName, trend);
        }

        return new ArrayList<>(trendMap.values());
    }

    private double safeDouble(Double value) {
        return value != null ? value : 0.0;
    }
}
