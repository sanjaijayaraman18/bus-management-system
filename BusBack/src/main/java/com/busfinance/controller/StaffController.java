package com.busfinance.controller;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.busfinance.entity.Conductor;
import com.busfinance.entity.Driver;
import com.busfinance.entity.Cleaner;
import com.busfinance.repository.ConductorRepository;
import com.busfinance.repository.DriverRepository;
import com.busfinance.repository.CleanerRepository;
import com.busfinance.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Transactional
public class StaffController {

    private final DriverRepository driverRepository;
    private final ConductorRepository conductorRepository;
    private final CleanerRepository cleanerRepository;
    private final com.busfinance.repository.DailyFinanceRepository dailyFinanceRepository;
    private final SecurityUtils securityUtils;

    // Driver Endpoints
    @GetMapping("/drivers")
    public List<Driver> getAllDrivers() {
        List<Driver> drivers;
        if (securityUtils.isAdmin()) {
            drivers = driverRepository.findAll();
        } else {
            drivers = driverRepository.findByOwner(securityUtils.getCurrentUser());
        }
        for (Driver driver : drivers) {
            calculateDriverBalance(driver);
        }
        return drivers;
    }

    private void calculateDriverBalance(Driver driver) {
        List<com.busfinance.entity.DailyFinance> reports = dailyFinanceRepository.findByDriverName(driver.getName());
        if (reports.isEmpty()) {
            driver.setWalletBalance(0.0);
            return;
        }

        java.util.Set<String> uniqueAssignments = new java.util.HashSet<>();
        double totalSalary = 0.0;
        double totalPaid = 0.0;

        for (com.busfinance.entity.DailyFinance f : reports) {
            if (f.getRoute() != null && f.getDate() != null) {
                String assignmentKey = f.getRoute().getId() + "_" + f.getDate().toString();
                if (!uniqueAssignments.contains(assignmentKey)) {
                    uniqueAssignments.add(assignmentKey);
                    totalSalary += (f.getRoute().getDriverSalary() != null ? f.getRoute().getDriverSalary() : 0.0);
                }
            }
            totalPaid += (f.getDriverSalaryPaid() != null ? f.getDriverSalaryPaid() : 0.0);
        }
        driver.setWalletBalance(totalSalary - totalPaid);
    }

    @PostMapping("/drivers")
    public Driver addDriver(@RequestBody Driver driver) {
        driver.setOwner(securityUtils.getCurrentUser());
        return driverRepository.save(driver);
    }

    @GetMapping("/drivers/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found"));
        
        if (!securityUtils.isAdmin()) {
            if (driver.getOwner() == null || securityUtils.getCurrentUser() == null || !driver.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
            }
        }
        calculateDriverBalance(driver);
        return driver;
    }

    @PutMapping("/drivers/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver existing = getDriverById(id);
        existing.setName(driver.getName());
        existing.setMobileNumber(driver.getMobileNumber());
        existing.setAge(driver.getAge());
        existing.setLicenseNumber(driver.getLicenseNumber());
        existing.setAadharNumber(driver.getAadharNumber());
        return driverRepository.save(existing);
    }
    

    // Conductor Endpoints
    @GetMapping("/conductors")
    public List<Conductor> getAllConductors() {
        List<Conductor> conductors;
        if (securityUtils.isAdmin()) {
            conductors = conductorRepository.findAll();
        } else {
            conductors = conductorRepository.findByOwner(securityUtils.getCurrentUser());
        }
        for (Conductor conductor : conductors) {
            calculateConductorBalance(conductor);
        }
        return conductors;
    }

    private void calculateConductorBalance(Conductor conductor) {
        List<com.busfinance.entity.DailyFinance> reports = dailyFinanceRepository.findByConductorName(conductor.getName());
        if (reports.isEmpty()) {
            conductor.setWalletBalance(0.0);
            return;
        }

        java.util.Set<String> uniqueAssignments = new java.util.HashSet<>();
        double totalSalary = 0.0;
        double totalPaid = 0.0;

        for (com.busfinance.entity.DailyFinance f : reports) {
            if (f.getRoute() != null && f.getDate() != null) {
                String assignmentKey = f.getRoute().getId() + "_" + f.getDate().toString();
                if (!uniqueAssignments.contains(assignmentKey)) {
                    uniqueAssignments.add(assignmentKey);
                    totalSalary += (f.getRoute().getConductorSalary() != null ? f.getRoute().getConductorSalary() : 0.0);
                }
            }
            totalPaid += (f.getConductorSalaryPaid() != null ? f.getConductorSalaryPaid() : 0.0);
        }
        conductor.setWalletBalance(totalSalary - totalPaid);
    }

    @PostMapping("/conductors")
    public Conductor addConductor(@RequestBody Conductor conductor) {
        conductor.setOwner(securityUtils.getCurrentUser());
        return conductorRepository.save(conductor);
    }

    @GetMapping("/conductors/{id}")
    public Conductor getConductorById(@PathVariable Long id) {
        Conductor conductor = conductorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conductor not found"));
        
        if (!securityUtils.isAdmin()) {
            if (conductor.getOwner() == null || securityUtils.getCurrentUser() == null || !conductor.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
            }
        }
        calculateConductorBalance(conductor);
        return conductor;
    }

    @PutMapping("/conductors/{id}")
    public Conductor updateConductor(@PathVariable Long id, @RequestBody Conductor conductor) {
        Conductor existing = getConductorById(id);
        existing.setName(conductor.getName());
        existing.setMobileNumber(conductor.getMobileNumber());
        existing.setAge(conductor.getAge());
        existing.setEmployeeId(conductor.getEmployeeId());
        return conductorRepository.save(existing);
    }

    // Cleaner Endpoints
    @GetMapping("/cleaners")
    public List<Cleaner> getAllCleaners() {
        List<Cleaner> cleaners;
        if (securityUtils.isAdmin()) {
            cleaners = cleanerRepository.findAll();
        } else {
            cleaners = cleanerRepository.findByOwner(securityUtils.getCurrentUser());
        }

        for (Cleaner cleaner : cleaners) {
            calculateCleanerBalance(cleaner);
        }
        return cleaners;
    }

    private void calculateCleanerBalance(Cleaner cleaner) {
        List<com.busfinance.entity.DailyFinance> reports = dailyFinanceRepository.findByCleanerName(cleaner.getName());
        if (reports.isEmpty()) {
            cleaner.setWalletBalance(0.0);
            return;
        }

        // Logic: Group by (routeId, date) to count fixed salary once per unique assignment
        // and sum all paid amounts (padi).
        java.util.Set<String> uniqueAssignments = new java.util.HashSet<>();
        double totalSalary = 0.0;
        double totalPaid = 0.0;

        for (com.busfinance.entity.DailyFinance f : reports) {
            if (f.getRoute() != null && f.getDate() != null) {
                String assignmentKey = f.getRoute().getId() + "_" + f.getDate().toString();
                if (!uniqueAssignments.contains(assignmentKey)) {
                    uniqueAssignments.add(assignmentKey);
                    totalSalary += (f.getRoute().getCleanerSalary() != null ? f.getRoute().getCleanerSalary() : 0.0);
                }
            }
            totalPaid += (f.getCleanerPadi() != null ? f.getCleanerPadi() : 0.0);
        }
        cleaner.setWalletBalance(totalSalary - totalPaid);
    }

    @PostMapping("/cleaners")
    public Cleaner addCleaner(@RequestBody Cleaner cleaner) {
        cleaner.setOwner(securityUtils.getCurrentUser());
        return cleanerRepository.save(cleaner);
    }

    @GetMapping("/cleaners/{id}")
    public Cleaner getCleanerById(@PathVariable Long id) {
        Cleaner cleaner = cleanerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cleaner not found"));
        
        if (!securityUtils.isAdmin()) {
            if (cleaner.getOwner() == null || securityUtils.getCurrentUser() == null || !cleaner.getOwner().getId().equals(securityUtils.getCurrentUser().getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
            }
        }
        calculateCleanerBalance(cleaner);
        return cleaner;
    }

    @PutMapping("/cleaners/{id}")
    public Cleaner updateCleaner(@PathVariable Long id, @RequestBody Cleaner cleaner) {
        Cleaner existing = getCleanerById(id);
        existing.setName(cleaner.getName());
        existing.setMobileNumber(cleaner.getMobileNumber());
        existing.setAge(cleaner.getAge());
        return cleanerRepository.save(existing);
    }

    @org.springframework.web.bind.annotation.GetMapping("/all")
    public List<java.util.Map<String, Object>> getAllWorkers(
            @org.springframework.web.bind.annotation.RequestParam(value = "role", required = false) String role,
            @org.springframework.web.bind.annotation.RequestParam(value = "name", required = false) String name) {
        
        List<java.util.Map<String, Object>> workers = new java.util.ArrayList<>();
        
        // Treat empty strings as null for easier logic
        String searchRole = (role != null && !role.trim().isEmpty()) ? role.trim() : null;
        String searchName = (name != null && !name.trim().isEmpty()) ? name.trim().toLowerCase() : null;

        // Drivers
        if (searchRole == null || searchRole.equalsIgnoreCase("Driver")) {
            getAllDrivers().forEach(d -> {
                if (searchName == null || d.getName().toLowerCase().contains(searchName)) {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", d.getId());
                    map.put("name", d.getName());
                    map.put("mobileNumber", d.getMobileNumber());
                    map.put("role", "Driver");
                    map.put("walletBalance", d.getWalletBalance());
                    workers.add(map);
                }
            });
        }
        
        // Conductors
        if (searchRole == null || searchRole.equalsIgnoreCase("Conductor")) {
            getAllConductors().forEach(c -> {
                if (searchName == null || c.getName().toLowerCase().contains(searchName)) {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", c.getId());
                    map.put("name", c.getName());
                    map.put("mobileNumber", c.getMobileNumber());
                    map.put("role", "Conductor");
                    map.put("walletBalance", c.getWalletBalance());
                    workers.add(map);
                }
            });
        }
        
        // Cleaners
        if (searchRole == null || searchRole.equalsIgnoreCase("Cleaner")) {
            getAllCleaners().forEach(cl -> {
                if (searchName == null || cl.getName().toLowerCase().contains(searchName)) {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", cl.getId());
                    map.put("name", cl.getName());
                    map.put("mobileNumber", cl.getMobileNumber());
                    map.put("role", "Cleaner");
                    map.put("walletBalance", cl.getWalletBalance());
                    workers.add(map);
                }
            });
        }
        
        return workers;
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/drivers/{id}")
    public void deleteDriver(@PathVariable Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/conductors/{id}")
    public void deleteConductor(@PathVariable Long id) {
        Conductor conductor = getConductorById(id);
        conductorRepository.delete(conductor);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/cleaners/{id}")
    public void deleteCleaner(@PathVariable Long id) {
        Cleaner cleaner = getCleanerById(id);
        cleanerRepository.delete(cleaner);
    }
}
