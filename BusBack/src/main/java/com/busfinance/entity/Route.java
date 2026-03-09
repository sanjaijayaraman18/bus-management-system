package com.busfinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Route name is required")
    private String routeName;

    @NotBlank(message = "Start location is required")
    private String startLocation;

    @NotBlank(message = "End location is required")
    private String endLocation;

    @NotNull(message = "Distance is required")
    private Double distance;

    @NotNull(message = "Driver salary is required")
    private Double driverSalary;

    @NotNull(message = "Conductor salary is required")
    private Double conductorSalary;

    @NotNull(message = "Cleaner salary is required")
    private Double cleanerSalary;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
