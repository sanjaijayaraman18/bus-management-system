package com.busfinance.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.busfinance.entity.DailyFinance;
import com.busfinance.entity.Route;
import com.busfinance.entity.User;
import com.busfinance.repository.DailyFinanceRepository;
import com.busfinance.repository.RouteRepository;
import com.busfinance.security.SecurityUtils;
import com.busfinance.service.DailyFinanceService;

import lombok.RequiredArgsConstructor;

/**
 * Service Implementation for Daily Finance calculations.
 */
@Service
@RequiredArgsConstructor
public class DailyFinanceServiceImpl implements DailyFinanceService {

    private final DailyFinanceRepository dailyFinanceRepository;
    private final RouteRepository routeRepository;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public DailyFinance saveFinance(DailyFinance finance) {
        // 1. Initial manual inputs (Paid amounts)
        double totalCollection = safeDouble(finance.getTotalCollection());
        double driverSalPaid = safeDouble(finance.getDriverSalaryPaid());
        double condSalPaid = safeDouble(finance.getConductorSalaryPaid());
        
        // 2. Default Fixed Salaries to 0 if no route is found
        double fixedDriverSal = 0.0;
        double fixedCondSal = 0.0;
        double fixedCleanerSal = 0.0;

        // 3. Fetch Route and get Fixed Salaries for Balance Calculation
        if (finance.getRoute() != null && finance.getRoute().getId() != null) {
            Route route = routeRepository.findById(finance.getRoute().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));
            
            // Set the full route to ensure we have all details
            finance.setRoute(route);

            fixedDriverSal = safeDouble(route.getDriverSalary());
            fixedCondSal = safeDouble(route.getConductorSalary());
            fixedCleanerSal = safeDouble(route.getCleanerSalary());
        }

        // 4. Calculate Pending Salary Balances: Fixed - Paid
        // Formula: Driver Balance = Route.driverSalary - driverSalaryPaid
        double driverBal = fixedDriverSal - driverSalPaid;
        double condBal = fixedCondSal - condSalPaid;
        double cleanerBal = fixedCleanerSal - safeDouble(finance.getCleanerPadi());

        finance.setDriverBalanceSalary(driverBal);
        finance.setConductorBalanceSalary(condBal);
        finance.setCleanerBalanceSalary(cleanerBal);

        // 5. Calculate Net Balance (Trip Profit)
        // Formula: Total Collection - (Fixed Salaries + Other Expenses)
        // We use fixed salaries because they represent the total expense for the trip (Paid + Pending)
        double otherExpenses = safeDouble(finance.getDieselExpense())
                             + safeDouble(finance.getCleanerPadi())
                             + safeDouble(finance.getUnionFee())
                             + safeDouble(finance.getPooSelavu());

        // We use actual paid salaries for the "Expected Trip Profit" as per user request
        double totalTripExpense = driverSalPaid + condSalPaid + otherExpenses;
        double netBalance = totalCollection - totalTripExpense;

        finance.setBalance(netBalance);
        
        // 6. Set Metadata and Save
        finance.setOwner(securityUtils.getCurrentUser());
        return dailyFinanceRepository.save(finance);
    }

    private double safeDouble(Double value) {
        return Optional.ofNullable(value).orElse(0.0);
    }

    @Override
    public List<DailyFinance> getAllFinance() {
        User currentUser = securityUtils.getCurrentUser();
        boolean isAdmin = securityUtils.isAdmin();
        
        System.out.println("DEBUG: Fetching all finance records.");
        System.out.println("DEBUG: Current User: " + (currentUser != null ? currentUser.getEmail() : "ANONYMOUS"));
        System.out.println("DEBUG: Is Admin: " + isAdmin);
        
        List<DailyFinance> results;
        if (isAdmin) {
            results = dailyFinanceRepository.findAll();
            System.out.println("DEBUG: Admin fetch - found " + results.size() + " records.");
        } else if (currentUser != null) {
            results = dailyFinanceRepository.findByOwnerOrOwnerIsNull(currentUser);
            System.out.println("DEBUG: User fetch for " + currentUser.getEmail() + " - found " + results.size() + " records.");
        } else {
            System.out.println("WARNING: No authenticated user found for fetch.");
            results = dailyFinanceRepository.findByOwnerOrOwnerIsNull(null);
        }
        
        return results;
    }

    @Override
    public List<DailyFinance> getFinanceByDate(LocalDate date) {
        if (securityUtils.isAdmin()) {
            return dailyFinanceRepository.findByDate(date);
        }
        return dailyFinanceRepository.findByDateAndOwner(date, securityUtils.getCurrentUser());
    }

    @Override
    public DailyFinance getFinanceById(Long id) {
        DailyFinance record = dailyFinanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found with id: " + id));
        
        if (!securityUtils.isAdmin() && !record.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        return record;
    }

    @Override
    @Transactional
    public DailyFinance updateFinance(Long id, DailyFinance finance) {
        DailyFinance existing = getFinanceById(id);
        
        // Map updated values to existing entity only if they are provided (null-safe patch)
        if (finance.getDate() != null) existing.setDate(finance.getDate());
        if (finance.getDriverName() != null) existing.setDriverName(finance.getDriverName());
        if (finance.getConductorName() != null) existing.setConductorName(finance.getConductorName());
        if (finance.getCleanerName() != null) existing.setCleanerName(finance.getCleanerName());
        if (finance.getRoute() != null) existing.setRoute(finance.getRoute());
        
        if (finance.getDriverSalaryPaid() != null) existing.setDriverSalaryPaid(finance.getDriverSalaryPaid());
        if (finance.getConductorSalaryPaid() != null) existing.setConductorSalaryPaid(finance.getConductorSalaryPaid());
        if (finance.getCleanerPadi() != null) existing.setCleanerPadi(finance.getCleanerPadi());
        if (finance.getDieselLiters() != null) existing.setDieselLiters(finance.getDieselLiters());
        if (finance.getDieselPricePerLiter() != null) existing.setDieselPricePerLiter(finance.getDieselPricePerLiter());
        if (finance.getDieselExpense() != null) existing.setDieselExpense(finance.getDieselExpense());
        if (finance.getUnionFee() != null) existing.setUnionFee(finance.getUnionFee());
        if (finance.getPooSelavu() != null) existing.setPooSelavu(finance.getPooSelavu());
        if (finance.getTotalCollection() != null) existing.setTotalCollection(finance.getTotalCollection());

        // Use core logic (saveFinance) to recalculate balances and Net Profit
        return saveFinance(existing);
    }

    @Override
    @Transactional
    public void deleteFinance(Long id) {
        DailyFinance existing = getFinanceById(id);
        dailyFinanceRepository.delete(existing);
    }
}

