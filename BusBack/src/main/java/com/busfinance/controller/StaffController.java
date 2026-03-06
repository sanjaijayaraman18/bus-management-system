package com.busfinance.controller;

import com.busfinance.entity.Driver;
import com.busfinance.entity.Conductor;
import com.busfinance.repository.DriverRepository;
import com.busfinance.repository.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    // Driver Endpoints
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @PostMapping("/drivers")
    public Driver addDriver(@RequestBody Driver driver) {
        return driverRepository.save(driver);
    }

    @GetMapping("/drivers/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    @PutMapping("/drivers/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver existing = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
        existing.setName(driver.getName());
        existing.setMobileNumber(driver.getMobileNumber());
        existing.setAge(driver.getAge());
        return driverRepository.save(existing);
    }

    // Conductor Endpoints
    @GetMapping("/conductors")
    public List<Conductor> getAllConductors() {
        return conductorRepository.findAll();
    }

    @PostMapping("/conductors")
    public Conductor addConductor(@RequestBody Conductor conductor) {
        return conductorRepository.save(conductor);
    }

    @GetMapping("/conductors/{id}")
    public Conductor getConductorById(@PathVariable Long id) {
        return conductorRepository.findById(id).orElseThrow(() -> new RuntimeException("Conductor not found"));
    }

    @PutMapping("/conductors/{id}")
    public Conductor updateConductor(@PathVariable Long id, @RequestBody Conductor conductor) {
        Conductor existing = conductorRepository.findById(id).orElseThrow(() -> new RuntimeException("Conductor not found"));
        existing.setName(conductor.getName());
        existing.setMobileNumber(conductor.getMobileNumber());
        existing.setAge(conductor.getAge());
        return conductorRepository.save(existing);
    }
}
