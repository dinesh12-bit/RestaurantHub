package com.restauranthub.dto.response;

import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.entity.enums.PaymentStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class AdminOrderResponse {

    private Long orderId;

    private LocalDateTime orderDate;

    // Customer details
    private Long userId;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    // Order details
    private BigDecimal totalAmount;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private List<AdminOrderItemResponse> items;
}