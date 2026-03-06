package com.busfinance.service;

import com.busfinance.entity.DailyFinance;

import java.time.LocalDate;
import java.util.List;

public interface DailyFinanceService {

    DailyFinance saveFinance(DailyFinance finance);
    List<DailyFinance> getAllFinance();
    List<DailyFinance> getFinanceByDate(LocalDate date);
    DailyFinance getFinanceById(Long id);
    DailyFinance updateFinance(Long id, DailyFinance finance);
    void deleteFinance(Long id);
}
