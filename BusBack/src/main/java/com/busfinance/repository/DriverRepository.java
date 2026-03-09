package com.busfinance.repository;

import com.busfinance.entity.Driver;
import com.busfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByOwner(User owner);
}
