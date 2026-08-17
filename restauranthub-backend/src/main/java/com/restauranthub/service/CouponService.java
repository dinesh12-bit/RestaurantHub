package com.restauranthub.service;

import com.restauranthub.dto.request.CouponRequest;
import com.restauranthub.dto.response.CouponResponse;
import com.restauranthub.entity.Coupon;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    // Create Coupon
    public CouponResponse createCoupon(CouponRequest request) {

        if (couponRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .discountPercentage(request.getDiscountPercentage())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .minimumOrderAmount(request.getMinimumOrderAmount())
                .active(request.getActive())
                .expiryDate(request.getExpiryDate())
                .usageLimit(request.getUsageLimit())
                .build();

        Coupon savedCoupon = couponRepository.save(coupon);

        return toResponse(savedCoupon);
    }

    // Validate Coupon and Calculate Discount
    public BigDecimal calculateDiscount(
            String code,
            BigDecimal orderAmount) {

        Coupon coupon = couponRepository.findByCode(code.toUpperCase())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coupon not found"
                        ));

        // Active check
        if (!Boolean.TRUE.equals(coupon.getActive())) {
            throw new RuntimeException(
                    "Coupon is inactive"
            );
        }

        // Expiry check
        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Coupon has expired"
            );
        }

        // Minimum order check
        if (orderAmount.compareTo(
                coupon.getMinimumOrderAmount()
        ) < 0) {

            throw new RuntimeException(
                    "Minimum order amount is ₹"
                            + coupon.getMinimumOrderAmount()
            );
        }

        // Calculate percentage discount
        BigDecimal discount = orderAmount
                .multiply(coupon.getDiscountPercentage())
                .divide(
                        BigDecimal.valueOf(100),
                        2,
                        RoundingMode.HALF_UP
                );

        // Apply maximum discount limit
        if (discount.compareTo(
                coupon.getMaxDiscountAmount()
        ) > 0) {

            discount = coupon.getMaxDiscountAmount();
        }

        return discount;
    }

    // Convert Entity → Response
    private CouponResponse toResponse(Coupon coupon) {

        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discountPercentage(
                        coupon.getDiscountPercentage()
                )
                .maxDiscountAmount(
                        coupon.getMaxDiscountAmount()
                )
                .minimumOrderAmount(
                        coupon.getMinimumOrderAmount()
                )
                .active(coupon.getActive())
                .expiryDate(coupon.getExpiryDate())
                .usageLimit(coupon.getUsageLimit())
                .build();
    }
    // Get All Coupons
    public java.util.List<CouponResponse> getAllCoupons() {

        return couponRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // Get Coupon By ID
    public CouponResponse getCouponById(Long id) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coupon not found"
                        )
                );

        return toResponse(coupon);
    }


    // Update Coupon
    public CouponResponse updateCoupon(
            Long id,
            CouponRequest request) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coupon not found"
                        )
                );

        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDiscountPercentage(
                request.getDiscountPercentage()
        );
        coupon.setMaxDiscountAmount(
                request.getMaxDiscountAmount()
        );
        coupon.setMinimumOrderAmount(
                request.getMinimumOrderAmount()
        );
        coupon.setActive(request.getActive());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setUsageLimit(request.getUsageLimit());

        return toResponse(
                couponRepository.save(coupon)
        );
    }


    // Delete Coupon
    public void deleteCoupon(Long id) {

        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coupon not found"
                        )
                );

        couponRepository.delete(coupon);
    }
}