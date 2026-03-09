package com.busfinance.service.impl;

import com.busfinance.entity.Route;
import com.busfinance.entity.User;
import com.busfinance.repository.RouteRepository;
import com.busfinance.security.SecurityUtils;
import com.busfinance.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final SecurityUtils securityUtils;

    @Override
    public Route createRoute(Route route) {
        route.setOwner(securityUtils.getCurrentUser());
        return routeRepository.save(route);
    }

    @Override
    public List<Route> getAllRoutes() {
        if (securityUtils.isAdmin()) {
            return routeRepository.findAll();
        }
        User currentUser = securityUtils.getCurrentUser();
        return routeRepository.findByOwner(currentUser);
    }

    @Override
    public List<com.busfinance.dto.RouteDTO> getRouteNames() {
        User currentUser = securityUtils.getCurrentUser();
        return routeRepository.findRouteNamesByOwner(currentUser);
    }

    @Override
    public Route getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        if (!securityUtils.isAdmin() && !route.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized access to route");
        }
        return route;
    }

    @Override
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }
}
