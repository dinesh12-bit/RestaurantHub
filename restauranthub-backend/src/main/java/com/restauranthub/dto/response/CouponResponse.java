package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class CouponResponse {

    private Long id;

    private String code;

    private BigDecimal discountPercentage;

    private BigDecimal maxDiscountAmount;

    private BigDecimal minimumOrderAmount;

    private Boolean active;

    private LocalDateTime expiryDate;

    private Integer usageLimit;
}