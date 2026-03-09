package com.busfinance.entity;

import jakarta.persistence.*;
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

    @NotBlank(message = "Cleaner name is required")
    @Column(name = "cleaner_name")
    private String cleanerName;

    @PositiveOrZero(message = "Driver salary amount must be positive or zero")
    private Double driverSalaryPaid; // User input

    @PositiveOrZero(message = "Conductor salary amount must be positive or zero")
    private Double conductorSalaryPaid; // User input

    @PositiveOrZero(message = "Diesel expense must be positive or zero")
    private Double dieselExpense; // Manual diesel cost entry

    @NotNull(message = "Diesel liters is required")
    private Double dieselLiters;

    @NotNull(message = "Diesel price per liter is required")
    private Double dieselPricePerLiter;

    @NotNull(message = "Total collection is required")
    private Double totalCollection;

    @PositiveOrZero(message = "Cleaner Padi must be positive or zero")
    private Double cleanerPadi; // User input, can be 0

    @PositiveOrZero(message = "Union fee must be positive or zero")
    private Double unionFee; // User input

    @PositiveOrZero(message = "Poo Selavu must be positive or zero")
    private Double pooSelavu; // User input

    private Double driverBalanceSalary; // route.driverSalary - driverSalaryPaid
    private Double conductorBalanceSalary; // route.conductorSalary - conductorSalaryPaid
    private Double cleanerBalanceSalary; // route.cleanerSalary - cleanerPadi

    private Double balance; // Calculated: Collection - (Sum of all expenses)

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}
