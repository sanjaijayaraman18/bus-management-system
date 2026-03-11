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
    @Column(name = "driver_salary_paid")
    private Double driverSalaryPaid; // User input

    @PositiveOrZero(message = "Conductor salary amount must be positive or zero")
    @Column(name = "conductor_salary_paid")
    private Double conductorSalaryPaid; // User input

    @PositiveOrZero(message = "Diesel expense must be positive or zero")
    @Column(name = "diesel_expense")
    private Double dieselExpense; // Manual diesel cost entry

    @NotNull(message = "Diesel liters is required")
    @Column(name = "diesel_liters")
    private Double dieselLiters;

    @NotNull(message = "Diesel price per liter is required")
    @Column(name = "diesel_price_per_liter")
    private Double dieselPricePerLiter;

    @NotNull(message = "Total collection is required")
    @Column(name = "total_collection")
    private Double totalCollection;

    @PositiveOrZero(message = "Cleaner Padi must be positive or zero")
    @Column(name = "cleaner_padi")
    private Double cleanerPadi; // User input, can be 0

    @PositiveOrZero(message = "Union fee must be positive or zero")
    @Column(name = "union_fee")
    private Double unionFee; // User input

    @PositiveOrZero(message = "Poo Selavu must be positive or zero")
    @Column(name = "poo_selavu")
    private Double pooSelavu; // User input

    @Column(name = "driver_balance_salary")
    private Double driverBalanceSalary; // route.driverSalary - driverSalaryPaid

    @Column(name = "conductor_balance_salary")
    private Double conductorBalanceSalary; // route.conductorSalary - conductorSalaryPaid

    @Column(name = "cleaner_balance_salary")
    private Double cleanerBalanceSalary; // route.cleanerSalary - cleanerPadi

    private Double balance; // Calculated: Collection - (Sum of all expenses)

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
}
