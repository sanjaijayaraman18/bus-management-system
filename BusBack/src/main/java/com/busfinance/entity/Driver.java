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

    @Transient
    private Double walletBalance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
