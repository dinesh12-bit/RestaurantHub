package com.restauranthub.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CouponRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Discount percentage is required")
    @DecimalMin(value = "0.1", message = "Discount must be greater than 0")
    private BigDecimal discountPercentage;

    @NotNull(message = "Maximum discount amount is required")
    @DecimalMin(value = "0.0", message = "Maximum discount cannot be negative")
    private BigDecimal maxDiscountAmount;

    @NotNull(message = "Minimum order amount is required")
    @DecimalMin(value = "0.0", message = "Minimum order amount cannot be negative")
    private BigDecimal minimumOrderAmount;

    private Boolean active = true;

    @NotNull(message = "Expiry date is required")
    private LocalDateTime expiryDate;

    private Integer usageLimit = 100;
}