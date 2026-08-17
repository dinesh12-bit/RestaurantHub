package com.restauranthub.controller;

import com.restauranthub.dto.response.AdminSalesResponse;
import com.restauranthub.service.AdminSalesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/sales")
public class AdminSalesController {

    private final AdminSalesService adminSalesService;

    public AdminSalesController(
            AdminSalesService adminSalesService) {

        this.adminSalesService = adminSalesService;
    }


    @GetMapping
    public ResponseEntity<AdminSalesResponse> getSales() {

        return ResponseEntity.ok(
                adminSalesService.getSalesSummary()
        );
    }
}