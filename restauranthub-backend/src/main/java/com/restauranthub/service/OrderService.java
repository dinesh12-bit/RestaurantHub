package com.restauranthub.service;

import com.restauranthub.dto.request.PlaceOrderRequest;
import com.restauranthub.dto.response.OrderResponse;
import com.restauranthub.entity.*;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.OrderMapper;
import com.restauranthub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    // =========================================================
    // PLACE ORDER
    // =========================================================

    @Transactional
    public OrderResponse placeOrder(
            Long userId,
            PlaceOrderRequest request) {

        // -----------------------------------------------------
        // 1. Find User
        // -----------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // -----------------------------------------------------
        // 2. Find Address
        // -----------------------------------------------------

        Address address = addressRepository.findById(
                        request.getAddressId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        // -----------------------------------------------------
        // 3. Find Cart
        // -----------------------------------------------------

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        // -----------------------------------------------------
        // 4. Check Cart
        // -----------------------------------------------------

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // -----------------------------------------------------
        // 5. Calculate Order Amount
        // -----------------------------------------------------

        BigDecimal orderAmount = cart.getTotalAmount();

        if (orderAmount == null) {
            orderAmount = BigDecimal.ZERO;
        }

        BigDecimal discount = BigDecimal.ZERO;

        // -----------------------------------------------------
        // 6. Apply Coupon
        // -----------------------------------------------------

        if (request.getCouponCode() != null
                && !request.getCouponCode().isBlank()) {

            discount = couponService.calculateDiscount(
                    request.getCouponCode(),
                    orderAmount
            );

            if (discount == null) {
                discount = BigDecimal.ZERO;
            }
        }

        // -----------------------------------------------------
        // 7. Final Amount
        // -----------------------------------------------------

        BigDecimal finalAmount =
                orderAmount.subtract(discount);

        // Never allow negative amount
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        System.out.println("=================================");
        System.out.println("       PLACE ORDER");
        System.out.println("=================================");
        System.out.println("User ID      : " + userId);
        System.out.println("User Email   : " + user.getEmail());
        System.out.println("Address ID   : " + request.getAddressId());
        System.out.println("Cart Total   : ₹" + orderAmount);
        System.out.println("Coupon       : " + request.getCouponCode());
        System.out.println("Discount     : ₹" + discount);
        System.out.println("Final Amount : ₹" + finalAmount);

        // -----------------------------------------------------
        // 8. Create Order
        // -----------------------------------------------------

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(finalAmount)
                .build();

        Order savedOrder = orderRepository.save(order);

        System.out.println(
                "✅ Order Saved : " + savedOrder.getId()
        );

        // -----------------------------------------------------
        // 9. Copy Cart Items -> Order Items
        // -----------------------------------------------------

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

            System.out.println(
                    "✅ Order Item Saved : "
                            + cartItem.getFood().getName()
            );
        }

        // -----------------------------------------------------
        // 10. Clear Cart
        // -----------------------------------------------------

        cartItemRepository.deleteAll(cart.getItems());

        cart.getItems().clear();

        cart.setTotalAmount(BigDecimal.ZERO);

        cartRepository.save(cart);

        System.out.println("✅ Cart Cleared");

        // -----------------------------------------------------
        // 11. Send Confirmation Email
        //
        // IMPORTANT:
        // Email failure must NOT cancel the order.
        // -----------------------------------------------------

        try {

            emailService.sendOrderConfirmationEmail(
                    user.getEmail(),
                    savedOrder.getId(),
                    savedOrder.getTotalAmount().doubleValue()
            );

            System.out.println(
                    "✅ Confirmation Email Sent"
            );

        } catch (Exception e) {

            System.out.println(
                    "⚠️ Order created successfully, "
                            + "but confirmation email failed."
            );

            System.out.println(
                    "Email Error : " + e.getMessage()
            );
        }

        // -----------------------------------------------------
        // 12. Return Order Response
        // -----------------------------------------------------

        System.out.println(
                "✅ ORDER COMPLETED : "
                        + savedOrder.getId()
        );

        System.out.println("=================================");

        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .orderDate(savedOrder.getOrderDate())
                .orderStatus(savedOrder.getOrderStatus())
                .paymentStatus(savedOrder.getPaymentStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .items(List.of())
                .build();
    }

    // =========================================================
    // GET MY ORDERS
    // =========================================================

    public List<OrderResponse> getMyOrders(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(OrderMapper::toOrderResponse)
                .toList();
    }

    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        return OrderMapper.toOrderResponse(order);
    }

    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Transactional
    public OrderResponse cancelOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setOrderStatus(
                com.restauranthub.entity.enums.OrderStatus.CANCELLED
        );

        Order updatedOrder =
                orderRepository.save(order);

        return OrderMapper.toOrderResponse(updatedOrder);
    }
}