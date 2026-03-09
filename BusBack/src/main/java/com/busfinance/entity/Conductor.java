package com.busfinance.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "conductors")
@Data
public class Conductor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String mobileNumber;
    private Integer age;
    private String employeeId;

    @Transient
    private Double walletBalance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
