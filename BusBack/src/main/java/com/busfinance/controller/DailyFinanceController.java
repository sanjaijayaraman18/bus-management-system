package com.busfinance.controller;

import com.busfinance.entity.DailyFinance;
import com.busfinance.service.DailyFinanceService;
import com.busfinance.service.PdfReportService;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class DailyFinanceController {

    private final DailyFinanceService dailyFinanceService;
    private final PdfReportService pdfReportService;

    // Constructor Injection
    public DailyFinanceController(DailyFinanceService dailyFinanceService, PdfReportService pdfReportService) {
        this.dailyFinanceService = dailyFinanceService;
        this.pdfReportService = pdfReportService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveFinance(@Valid @RequestBody DailyFinance finance) {
        try {
            DailyFinance savedFinance = dailyFinanceService.saveFinance(finance);
            return new ResponseEntity<>(savedFinance, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of(
                        "message", "Failed to save record: " + e.getMessage(),
                        "error", e.getClass().getSimpleName()
                    ));
        }
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
    public ResponseEntity<DailyFinance> updateFinance(@PathVariable Long id, @RequestBody DailyFinance finance) {
        DailyFinance updatedFinance = dailyFinanceService.updateFinance(id, finance);
        return ResponseEntity.ok(updatedFinance);
    }

    @GetMapping("/report/{id}/pdf")
    public ResponseEntity<InputStreamResource> downloadReport(@PathVariable Long id) {
        DailyFinance finance = dailyFinanceService.getFinanceById(id);
        ByteArrayInputStream bis = pdfReportService.generateFinancePdf(finance);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Daily_Report_" + finance.getDate() + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
    
}
