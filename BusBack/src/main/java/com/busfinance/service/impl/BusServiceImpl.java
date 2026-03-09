package com.busfinance.service.impl;

import com.busfinance.entity.Bus;
import com.busfinance.entity.User;
import com.busfinance.repository.BusRepository;
import com.busfinance.security.SecurityUtils;
import com.busfinance.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final SecurityUtils securityUtils;

    @Override
    public Bus createBus(Bus bus) {
        bus.setOwner(securityUtils.getCurrentUser());
        return busRepository.save(bus);
    }

    @Override
    public List<Bus> getAllBuses() {
        if (securityUtils.isAdmin()) {
            return busRepository.findAll();
        }
        User currentUser = securityUtils.getCurrentUser();
        return busRepository.findByOwner(currentUser);
    }

    @Override
    public Bus getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        
        if (!securityUtils.isAdmin() && !bus.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized access to bus");
        }
        return bus;
    }

    @Override
    public void deleteBus(Long id) {
        Bus bus = getBusById(id);
        busRepository.delete(bus);
    }
}
