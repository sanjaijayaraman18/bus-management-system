package com.busfinance.repository;

import com.busfinance.entity.Conductor;
import com.busfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {
    List<Conductor> findByOwner(User owner);
}
