package com.busfinance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "daily_finance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyFinance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Driver name is required")
    private String driverName;

    @NotBlank(message = "Conductor name is required")
    private String conductorName;

    @PositiveOrZero(message = "Driver salary paid must be positive or zero")
    private Double driverSalaryPaid;

    @PositiveOrZero(message = "Conductor salary paid must be positive or zero")
    private Double conductorSalaryPaid;

    private Double driverBalanceSalary; // Auto calculated: 500 - paid

    private Double conductorBalanceSalary; // Auto calculated: 400 - paid

    @NotNull(message = "Diesel liters is required")
    private Double dieselLiters;

    @NotNull(message = "Diesel price per liter is required")
    private Double dieselPricePerLiter;

    @NotNull(message = "Total collection is required")
    private Double totalCollection;

    private Double balance; // Net balance after all expenses

    private Boolean includeUnionFees = true;

    private Boolean includePooSelavu = true;

    @PositiveOrZero(message = "Cleaner Padi must be positive or zero")
    private Double cleanerPadi = 100.0;
}
