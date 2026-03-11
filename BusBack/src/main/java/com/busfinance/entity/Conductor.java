package com.busfinance.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "conductors")
@Data
public class Conductor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "age")
    private Integer age;

    @Column(name = "employee_id")
    private String employeeId;

    @Transient
    private Double walletBalance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
