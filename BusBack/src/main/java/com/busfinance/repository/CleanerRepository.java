package com.busfinance.repository;

import com.busfinance.entity.Cleaner;
import com.busfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CleanerRepository extends JpaRepository<Cleaner, Long> {
    List<Cleaner> findByOwner(User owner);
}
