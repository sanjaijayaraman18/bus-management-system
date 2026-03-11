package com.busfinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Route name is required")
    @Column(name = "route_name")
    private String routeName;

    @NotBlank(message = "Start location is required")
    @Column(name = "start_location")
    private String startLocation;

    @NotBlank(message = "End location is required")
    @Column(name = "end_location")
    private String endLocation;

    @NotNull(message = "Distance is required")
    @Column(name = "distance")
    private Double distance;

    @NotNull(message = "Driver salary is required")
    @Column(name = "driver_salary")
    private Double driverSalary;

    @NotNull(message = "Conductor salary is required")
    @Column(name = "conductor_salary")
    private Double conductorSalary;

    @NotNull(message = "Cleaner salary is required")
    @Column(name = "cleaner_salary")
    private Double cleanerSalary;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
