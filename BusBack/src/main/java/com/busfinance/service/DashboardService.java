package com.busfinance.service;

import com.busfinance.dto.DashboardData;
import com.busfinance.dto.DashboardSummary;

public interface DashboardService {
    DashboardData getDashboardData();
    DashboardSummary getSummary();
}
