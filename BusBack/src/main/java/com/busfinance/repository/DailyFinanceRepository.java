package com.busfinance.repository;

import com.busfinance.entity.DailyFinance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyFinanceRepository extends JpaRepository<DailyFinance, Long> {

    List<DailyFinance> findByDate(LocalDate date);
}
