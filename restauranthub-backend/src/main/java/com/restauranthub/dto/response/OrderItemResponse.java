package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderItemResponse {

    private Long foodId;

    private String foodName;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal subtotal;
}