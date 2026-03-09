package com.busfinance.service;

import com.busfinance.entity.Bus;
import java.util.List;

public interface BusService {
    Bus createBus(Bus bus);
    List<Bus> getAllBuses();
    Bus getBusById(Long id);
    void deleteBus(Long id);
}
