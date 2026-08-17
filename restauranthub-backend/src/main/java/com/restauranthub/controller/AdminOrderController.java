package com.restauranthub.controller;

import com.restauranthub.dto.request.UpdateOrderStatusRequest;
import com.restauranthub.dto.response.AdminOrderResponse;
import com.restauranthub.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(
            AdminOrderService adminOrderService) {

        this.adminOrderService =
                adminOrderService;
    }


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<AdminOrderResponse>>
    getAllOrders() {

        return ResponseEntity.ok(
                adminOrderService.getAllOrders()
        );
    }


    // =====================================================
    // GET ORDER DETAILS
    // =====================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<AdminOrderResponse>
    getOrderById(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                adminOrderService.getOrderById(
                        orderId
                )
        );
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<AdminOrderResponse>
    updateOrderStatus(

            @PathVariable Long orderId,

            @Valid
            @RequestBody
            UpdateOrderStatusRequest request) {

        return ResponseEntity.ok(
                adminOrderService.updateOrderStatus(
                        orderId,
                        request
                )
        );
    }
}