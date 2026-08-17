package com.restauranthub.service;

import com.restauranthub.dto.request.PlaceOrderRequest;
import com.restauranthub.dto.response.OrderResponse;
import com.restauranthub.entity.*;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.OrderMapper;
import com.restauranthub.repository.*;
import com.restauranthub.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final CouponService couponService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            EmailService emailService,
            CouponService couponService) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.couponService = couponService;

    }

    @Transactional
    public OrderResponse placeOrder(Long userId,
                                    PlaceOrderRequest request) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Find Address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        // Find Cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate Order Amount
        java.math.BigDecimal orderAmount = cart.getTotalAmount();

        java.math.BigDecimal discount = java.math.BigDecimal.ZERO;

// Apply Coupon if provided
        if (request.getCouponCode() != null &&
                !request.getCouponCode().isBlank()) {

            discount = couponService.calculateDiscount(
                    request.getCouponCode(),
                    orderAmount
            );
        }

// Final Amount
        java.math.BigDecimal finalAmount =
                orderAmount.subtract(discount);

        System.out.println("Cart Total   : ₹" + orderAmount);
        System.out.println("Coupon       : " + request.getCouponCode());
        System.out.println("Discount     : ₹" + discount);
        System.out.println("Final Amount : ₹" + finalAmount);

// Create Order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(finalAmount)
                .build();

        Order savedOrder = orderRepository.save(order);

        System.out.println("✅ Order Saved : " + savedOrder.getId());

        // Copy Cart Items to Order Items
        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .food(cartItem.getFood())
                    .foodName(cartItem.getFood().getName())
                    .price(cartItem.getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(cartItem.getSubtotal())
                    .build();

            orderItemRepository.save(orderItem);

            savedOrder.getItems().add(orderItem);

            System.out.println("✅ Order Item Saved");
        }

        // Clear Cart
        cartItemRepository.deleteAll(cart.getItems());

        cart.getItems().clear();
        cart.setTotalAmount(java.math.BigDecimal.ZERO);

        cartRepository.save(cart);

        System.out.println("✅ Cart Cleared");

        emailService.sendOrderConfirmationEmail(
                user.getEmail(),
                savedOrder.getId(),
                savedOrder.getTotalAmount().doubleValue()
        );

        System.out.println("✅ Confirmation Email Sent");

        // Temporary Response (Mapper skip)
        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .orderDate(savedOrder.getOrderDate())
                .orderStatus(savedOrder.getOrderStatus())
                .paymentStatus(savedOrder.getPaymentStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .items(List.of())
                .build();
    }
    public List<OrderResponse> getMyOrders(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(OrderMapper::toOrderResponse)
                .toList();
    }
    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        return OrderMapper.toOrderResponse(order);
    }
    @Transactional
    public OrderResponse cancelOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setOrderStatus(
                com.restauranthub.entity.enums.OrderStatus.CANCELLED
        );

        Order updatedOrder = orderRepository.save(order);

        return OrderMapper.toOrderResponse(updatedOrder);
    }

}