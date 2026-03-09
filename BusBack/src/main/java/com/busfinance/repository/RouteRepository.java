package com.busfinance.repository;

import com.busfinance.entity.Route;
import com.busfinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.busfinance.dto.RouteDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByOwner(User owner);

    @Query("SELECT new com.busfinance.dto.RouteDTO(r.id, r.routeName) FROM Route r WHERE r.owner = :owner")
    List<RouteDTO> findRouteNamesByOwner(@Param("owner") User owner);
}
