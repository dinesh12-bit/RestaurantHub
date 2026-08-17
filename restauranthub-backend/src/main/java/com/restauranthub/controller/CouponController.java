package com.restauranthub.controller;

import com.restauranthub.dto.request.CouponRequest;
import com.restauranthub.dto.response.CouponResponse;
import com.restauranthub.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    // Create Coupon
    @PostMapping
    public ResponseEntity<CouponResponse> createCoupon(
            @Valid @RequestBody CouponRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(couponService.createCoupon(request));
    }

    // Calculate Coupon Discount
    @GetMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {

        BigDecimal discount =
                couponService.calculateDiscount(
                        code,
                        orderAmount
                );

        BigDecimal finalAmount =
                orderAmount.subtract(discount);

        return ResponseEntity.ok(
                Map.of(
                        "couponCode", code.toUpperCase(),
                        "orderAmount", orderAmount,
                        "discountAmount", discount,
                        "finalAmount", finalAmount
                )
        );
    }
    // Get All Coupons
    @GetMapping
    public ResponseEntity<java.util.List<CouponResponse>>
    getAllCoupons() {

        return ResponseEntity.ok(
                couponService.getAllCoupons()
        );
    }


    // Get Coupon By ID
    @GetMapping("/{id}")
    public ResponseEntity<CouponResponse>
    getCouponById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                couponService.getCouponById(id)
        );
    }


    // Update Coupon
    @PutMapping("/{id}")
    public ResponseEntity<CouponResponse>
    updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request) {

        return ResponseEntity.ok(
                couponService.updateCoupon(
                        id,
                        request
                )
        );
    }


    // Delete Coupon
    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteCoupon(
            @PathVariable Long id) {

        couponService.deleteCoupon(id);

        return ResponseEntity.ok(
                "Coupon deleted successfully"
        );
    }
}