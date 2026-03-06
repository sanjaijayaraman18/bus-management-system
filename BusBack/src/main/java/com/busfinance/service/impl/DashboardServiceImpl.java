package com.busfinance.service.impl;

import com.busfinance.dto.ChartDataPoint;
import com.busfinance.dto.DashboardData;
import com.busfinance.dto.DashboardSummary;
import com.busfinance.dto.MonthlyTrend;
import com.busfinance.entity.DailyFinance;
import com.busfinance.repository.DailyFinanceRepository;
import com.busfinance.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DailyFinanceRepository dailyFinanceRepository;

    public DashboardServiceImpl(DailyFinanceRepository dailyFinanceRepository) {
        this.dailyFinanceRepository = dailyFinanceRepository;
    }

    @Override
    public DashboardData getDashboardData() {
        List<DailyFinance> allFinance = dailyFinanceRepository.findAll();
        DashboardSummary summary = calculateSummary(allFinance);
        List<ChartDataPoint> monthlyIncome = calculateMonthlyIncome(allFinance);
        List<MonthlyTrend> financialTrends = calculateFinancialTrends(allFinance);

        return new DashboardData(summary, monthlyIncome, financialTrends);
    }

    @Override
    public DashboardSummary getSummary() {
        List<DailyFinance> allFinance = dailyFinanceRepository.findAll();
        return calculateSummary(allFinance);
    }

    private DashboardSummary calculateSummary(List<DailyFinance> records) {
        LocalDate today = LocalDate.now();
        List<DailyFinance> todayRecords = records.stream()
                .filter(r -> r.getDate().equals(today))
                .collect(Collectors.toList());

        double todayCollection = todayRecords.stream().mapToDouble(r -> safeDouble(r.getTotalCollection())).sum();
        double todayDiesel = todayRecords.stream().mapToDouble(r -> safeDouble(r.getDieselLiters()) * safeDouble(r.getDieselPricePerLiter())).sum();
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
            double expense = (safeDouble(record.getDieselLiters()) * safeDouble(record.getDieselPricePerLiter())) 
                            + safeDouble(record.getDriverSalaryPaid()) 
                            + safeDouble(record.getConductorSalaryPaid())
                            + safeDouble(record.getCleanerPadi());
            
            if (Boolean.TRUE.equals(record.getIncludeUnionFees())) expense += 52.0;
            if (Boolean.TRUE.equals(record.getIncludePooSelavu())) expense += 20.0;

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
