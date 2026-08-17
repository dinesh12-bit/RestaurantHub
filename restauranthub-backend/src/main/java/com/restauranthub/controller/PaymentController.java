package com.restauranthub.controller;

import com.restauranthub.dto.request.VerifyPaymentRequest;
import com.restauranthub.dto.response.PaymentResponse;
import com.restauranthub.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }


    // =====================================================
    // CREATE RAZORPAY PAYMENT
    // =====================================================

    @PostMapping("/create/{orderId}")
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Long orderId)
            throws RazorpayException {

        return ResponseEntity.ok(
                paymentService.createPayment(orderId)
        );
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody VerifyPaymentRequest request)
            throws RazorpayException {

        return ResponseEntity.ok(
                paymentService.verifyPayment(request)
        );
    }
}