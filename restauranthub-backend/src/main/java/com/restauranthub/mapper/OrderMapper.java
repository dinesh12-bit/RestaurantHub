package com.restauranthub.mapper;

import com.restauranthub.dto.response.OrderItemResponse;
import com.restauranthub.dto.response.OrderResponse;
import com.restauranthub.entity.Order;
import com.restauranthub.entity.OrderItem;

import java.util.List;

public class OrderMapper {

    // OrderItem -> OrderItemResponse
    public static OrderItemResponse toOrderItemResponse(OrderItem item) {

        return OrderItemResponse.builder()
                .foodId(item.getFood().getId())
                .foodName(item.getFoodName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }

    // Order -> OrderResponse
    public static OrderResponse toOrderResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(OrderMapper::toOrderItemResponse)
                .toList();

        return OrderResponse.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .totalAmount(order.getTotalAmount())
                .items(items)
                .build();
    }
}