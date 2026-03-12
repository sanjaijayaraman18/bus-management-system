package com.busfinance.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cleaners")
@Data
public class Cleaner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "age")
    private Integer age;

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
