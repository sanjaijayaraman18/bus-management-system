package com.busfinance.controller;

import com.busfinance.entity.DailyFinance;
import com.busfinance.service.DailyFinanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class DailyFinanceController {

    private final DailyFinanceService dailyFinanceService;

    // Constructor Injection
    public DailyFinanceController(DailyFinanceService dailyFinanceService) {
        this.dailyFinanceService = dailyFinanceService;
    }

    @PostMapping("/save")
    public ResponseEntity<DailyFinance> saveFinance(@Valid @RequestBody DailyFinance finance) {
        DailyFinance savedFinance = dailyFinanceService.saveFinance(finance);
        return new ResponseEntity<>(savedFinance, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DailyFinance>> getAllFinance() {
        List<DailyFinance> allFinance = dailyFinanceService.getAllFinance();
        return ResponseEntity.ok(allFinance);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<DailyFinance>> getFinanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        System.out.println("DEBUG: Searching for finance record with date: " + date);
        List<DailyFinance> financeList = dailyFinanceService.getFinanceByDate(date);
        return ResponseEntity.ok(financeList);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFinance(@PathVariable Long id) {
        dailyFinanceService.deleteFinance(id);
        return ResponseEntity.ok("Record deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<DailyFinance> getFinanceById(@PathVariable Long id) {
        DailyFinance finance = dailyFinanceService.getFinanceById(id);
        return ResponseEntity.ok(finance);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DailyFinance> updateFinance(@PathVariable Long id, @Valid @RequestBody DailyFinance finance) {
        DailyFinance updatedFinance = dailyFinanceService.updateFinance(id, finance);
        return ResponseEntity.ok(updatedFinance);
    }
}
