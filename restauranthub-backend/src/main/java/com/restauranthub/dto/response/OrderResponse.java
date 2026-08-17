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
public class OrderResponse {

    private Long orderId;

    private LocalDateTime orderDate;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private BigDecimal totalAmount;

    private List<OrderItemResponse> items;
}