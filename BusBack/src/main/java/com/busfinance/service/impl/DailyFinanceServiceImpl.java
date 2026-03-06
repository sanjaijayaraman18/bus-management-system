package com.busfinance.service.impl;

import com.busfinance.entity.DailyFinance;
import com.busfinance.repository.DailyFinanceRepository;
import com.busfinance.service.DailyFinanceService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for Daily Finance calculations.
 * Exact Formula: Balance = Collection - DriverSalary - ConductorSalary - (Liters * Price) - Union - Poo
 */
@Service
public class DailyFinanceServiceImpl implements DailyFinanceService {

    // Global Constants (Daily Fixed Deductions)
    private static final double FIXED_DRIVER_BASE = 500.0;
    private static final double FIXED_CONDUCTOR_BASE = 400.0;
    private static final double UNION_FEES = 52.0;   // Constant per record
    private static final double POO_SELAVU = 20.0;  // Constant per record

    private final DailyFinanceRepository dailyFinanceRepository;

    public DailyFinanceServiceImpl(DailyFinanceRepository dailyFinanceRepository) {
        this.dailyFinanceRepository = dailyFinanceRepository;
    }

    @Override
    @Transactional
    public DailyFinance saveFinance(DailyFinance finance) {
        // Step 1: Extract data with Null Safety (Treat null as 0.0)
        double collection = safeDouble(finance.getTotalCollection());
        double driverSal = safeDouble(finance.getDriverSalaryPaid());
        double condSal = safeDouble(finance.getConductorSalaryPaid());
        double dieselLiters = safeDouble(finance.getDieselLiters());
        double dieselPrice = safeDouble(finance.getDieselPricePerLiter());

        // Step 2: Calculate Diesel Total Expense
        // Common Mistake: Subtracting liters separately. Only the product is a currency expense.
        double dieselTotalExpense = dieselLiters * dieselPrice;

        // Step 3: Apply the Standard Balance Formula
        // Balance = Collection - (Driver + Conductor + Diesel + Fees + Cleaner)
        double netBalance = collection 
                           - driverSal 
                           - condSal 
                           - dieselTotalExpense
                           - safeDouble(finance.getCleanerPadi()); 

        if (Boolean.TRUE.equals(finance.getIncludeUnionFees())) {
            netBalance -= UNION_FEES;
        }
        
        if (Boolean.TRUE.equals(finance.getIncludePooSelavu())) {
            netBalance -= POO_SELAVU;
        }

        // Step 4: Map calculations to Entity fields
        finance.setBalance(netBalance);
        
        // Internal Balances (Base - Paid)
        finance.setDriverBalanceSalary(FIXED_DRIVER_BASE - driverSal);
        finance.setConductorBalanceSalary(FIXED_CONDUCTOR_BASE - condSal);

        // Step 5: Save to Database
        return dailyFinanceRepository.save(finance);
    }

    private double safeDouble(Double value) {
        return Optional.ofNullable(value).orElse(0.0);
    }

    @Override
    public List<DailyFinance> getAllFinance() {
        return dailyFinanceRepository.findAll();
    }

    @Override
    public List<DailyFinance> getFinanceByDate(LocalDate date) {
        return dailyFinanceRepository.findByDate(date);
    }

    @Override
    public DailyFinance getFinanceById(Long id) {
        return dailyFinanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found with id: " + id));
    }

    @Override
    @Transactional
    public DailyFinance updateFinance(Long id, DailyFinance finance) {
        DailyFinance existing = getFinanceById(id);
        
        // Update fields safely
        if (finance.getDate() != null) existing.setDate(finance.getDate());
        if (finance.getDriverName() != null) existing.setDriverName(finance.getDriverName());
        if (finance.getConductorName() != null) existing.setConductorName(finance.getConductorName());
        
        existing.setDriverSalaryPaid(safeDouble(finance.getDriverSalaryPaid()));
        existing.setConductorSalaryPaid(safeDouble(finance.getConductorSalaryPaid()));
        existing.setCleanerPadi(safeDouble(finance.getCleanerPadi()));
        existing.setDieselLiters(safeDouble(finance.getDieselLiters()));
        existing.setDieselPricePerLiter(safeDouble(finance.getDieselPricePerLiter()));
        existing.setTotalCollection(safeDouble(finance.getTotalCollection()));
        
        existing.setIncludeUnionFees(finance.getIncludeUnionFees() != null ? finance.getIncludeUnionFees() : true);
        existing.setIncludePooSelavu(finance.getIncludePooSelavu() != null ? finance.getIncludePooSelavu() : true);

        // Recalculate and save using the existing logic in saveFinance
        return saveFinance(existing);
    }

    @Override
    @Transactional
    public void deleteFinance(Long id) {
        if (!dailyFinanceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found with id: " + id);
        }
        dailyFinanceRepository.deleteById(id);
    }
}
