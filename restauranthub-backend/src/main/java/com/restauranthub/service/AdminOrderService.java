package com.restauranthub.service;

import com.restauranthub.dto.request.UpdateOrderStatusRequest;
import com.restauranthub.dto.response.AdminOrderItemResponse;
import com.restauranthub.dto.response.AdminOrderResponse;
import com.restauranthub.entity.Order;
import com.restauranthub.entity.OrderItem;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    public List<AdminOrderResponse> getAllOrders() {

        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    public AdminOrderResponse getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        return toResponse(order);
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @Transactional
    public AdminOrderResponse updateOrderStatus(
            Long orderId,
            UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );

        OrderStatus currentStatus =
                order.getOrderStatus();

        OrderStatus newStatus =
                request.getStatus();


        // -------------------------------------------------
        // SAME STATUS
        // -------------------------------------------------

        if (currentStatus == newStatus) {

            return toResponse(order);
        }


        // -------------------------------------------------
        // CANCELLED ORDER
        // -------------------------------------------------

        if (currentStatus == OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled order cannot be updated"
            );
        }


        // -------------------------------------------------
        // DELIVERED ORDER
        // -------------------------------------------------

        if (currentStatus == OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "Delivered order cannot be updated"
            );
        }


        // -------------------------------------------------
        // VALIDATE STATUS FLOW
        // -------------------------------------------------

        validateStatusTransition(
                currentStatus,
                newStatus
        );


        order.setOrderStatus(newStatus);

        Order updatedOrder =
                orderRepository.save(order);

        return toResponse(updatedOrder);
    }


    // =====================================================
    // STATUS FLOW VALIDATION
    // =====================================================

    private void validateStatusTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus) {


        boolean valid = false;


        switch (currentStatus) {

            case PLACED:

                valid =
                        newStatus == OrderStatus.CONFIRMED
                                ||
                                newStatus == OrderStatus.CANCELLED;

                break;


            case CONFIRMED:

                valid =
                        newStatus == OrderStatus.PREPARING
                                ||
                                newStatus == OrderStatus.CANCELLED;

                break;


            case PREPARING:

                valid =
                        newStatus ==
                                OrderStatus.OUT_FOR_DELIVERY;

                break;


            case OUT_FOR_DELIVERY:

                valid =
                        newStatus ==
                                OrderStatus.DELIVERED;

                break;


            default:

                valid = false;
        }


        if (!valid) {

            throw new RuntimeException(
                    "Invalid order status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private AdminOrderResponse toResponse(Order order) {

        List<AdminOrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(this::toItemResponse)
                        .toList();


        return AdminOrderResponse.builder()

                .orderId(order.getId())

                .orderDate(order.getOrderDate())

                .userId(
                        order.getUser() != null
                                ? order.getUser().getId()
                                : null
                )

                .customerName(
                        order.getUser() != null
                                ? order.getUser().getFullName()
                                : null
                )

                .customerEmail(
                        order.getUser() != null
                                ? order.getUser().getEmail()
                                : null
                )

                .customerPhone(
                        order.getUser() != null
                                ? order.getUser().getPhone()
                                : null
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                .orderStatus(
                        order.getOrderStatus()
                )

                .paymentStatus(
                        order.getPaymentStatus()
                )

                .items(items)

                .build();
    }


    // =====================================================
    // ORDER ITEM → RESPONSE
    // =====================================================

    private AdminOrderItemResponse toItemResponse(
            OrderItem item) {

        return AdminOrderItemResponse.builder()

                .foodId(
                        item.getFood() != null
                                ? item.getFood().getId()
                                : null
                )

                .foodName(
                        item.getFoodName()
                )

                .price(
                        item.getPrice()
                )

                .quantity(
                        item.getQuantity()
                )

                .subtotal(
                        item.getSubtotal()
                )

                .build();
    }
}