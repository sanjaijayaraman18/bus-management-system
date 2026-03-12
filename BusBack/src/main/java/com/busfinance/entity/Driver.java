package com.busfinance.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "drivers")
@Data
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;
    @Column(name = "mobile_number")
    private String mobileNumber;
    private Integer age;
    @Column(name = "license_number")
    private String licenseNumber;
    @Column(name = "aadhar_number")
    private String aadharNumber;

    @Column(name = "fixed_salary")
    private Double fixedSalary;

    @ManyToOne
    @JoinColumn(name = "assigned_route_id")
    private Route assignedRoute;

    @Column(name = "wallet_balance")
    private Double walletBalance;

    @Transient
    private Double totalBalance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
