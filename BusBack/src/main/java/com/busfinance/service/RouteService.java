package com.busfinance.service;

import com.busfinance.dto.RouteDTO;
import com.busfinance.entity.Route;
import java.util.List;

public interface RouteService {
    Route createRoute(Route route);
    List<Route> getAllRoutes();
    List<RouteDTO> getRouteNames();
    Route getRouteById(Long id);
    void deleteRoute(Long id);
}
