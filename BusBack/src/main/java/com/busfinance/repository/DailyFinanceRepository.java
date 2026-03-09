package com.busfinance.repository;

import com.busfinance.entity.DailyFinance;
import com.busfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyFinanceRepository extends JpaRepository<DailyFinance, Long> {

    List<DailyFinance> findByDate(LocalDate date);
    List<DailyFinance> findByOwner(User owner);
    List<DailyFinance> findByOwnerOrOwnerIsNull(User owner);
    List<DailyFinance> findByDateAndOwner(LocalDate date, User owner);
    List<DailyFinance> findByCleanerName(String cleanerName);
    List<DailyFinance> findByDriverName(String driverName);
    List<DailyFinance> findByConductorName(String conductorName);
}
