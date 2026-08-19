package com.restauranthub.service;

import com.restauranthub.dto.request.PlaceOrderRequest;
import com.restauranthub.dto.response.OrderResponse;
import com.restauranthub.entity.Address;
import com.restauranthub.entity.Cart;
import com.restauranthub.entity.CartItem;
import com.restauranthub.entity.Order;
import com.restauranthub.entity.OrderItem;
import com.restauranthub.entity.User;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.OrderMapper;
import com.restauranthub.repository.AddressRepository;
import com.restauranthub.repository.CartItemRepository;
import com.restauranthub.repository.CartRepository;
import com.restauranthub.repository.OrderItemRepository;
import com.restauranthub.repository.OrderRepository;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
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

        System.out.println("================================");
        System.out.println("PLACE ORDER STARTED");
        System.out.println("User ID : " + userId);
        System.out.println("Address ID : " + request.getAddressId());
        System.out.println("Coupon : " + request.getCouponCode());
        System.out.println("================================");

        // -----------------------------------------------------
        // 1. FIND USER
        // -----------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        System.out.println("User found : " + user.getEmail());

        // -----------------------------------------------------
        // 2. FIND ADDRESS
        // -----------------------------------------------------

        Address address = addressRepository
                .findById(request.getAddressId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Address not found"));

        System.out.println(
                "Address found : " + address.getId());

        // -----------------------------------------------------
        // 3. FIND CART
        // -----------------------------------------------------

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"));

        System.out.println(
                "Cart found : " + cart.getId());

        System.out.println(
                "Cart items : " + cart.getItems().size());

        // -----------------------------------------------------
        // 4. CHECK CART
        // -----------------------------------------------------

        if (cart.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty");
        }

        // -----------------------------------------------------
        // 5. CALCULATE AMOUNT
        // -----------------------------------------------------

        BigDecimal orderAmount =
                cart.getTotalAmount();

        if (orderAmount == null) {
            orderAmount = BigDecimal.ZERO;
        }

        BigDecimal discount =
                BigDecimal.ZERO;

        // -----------------------------------------------------
        // 6. APPLY COUPON
        // -----------------------------------------------------

        if (request.getCouponCode() != null
                && !request.getCouponCode().isBlank()) {

            System.out.println(
                    "Applying coupon : "
                            + request.getCouponCode());

            discount = couponService.calculateDiscount(
                    request.getCouponCode(),
                    orderAmount
            );

            if (discount == null) {
                discount = BigDecimal.ZERO;
            }
        }

        // -----------------------------------------------------
        // 7. FINAL AMOUNT
        // -----------------------------------------------------

        BigDecimal finalAmount =
                orderAmount.subtract(discount);

        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        System.out.println(
                "Cart Total   : ₹" + orderAmount);

        System.out.println(
                "Coupon       : "
                        + request.getCouponCode());

        System.out.println(
                "Discount     : ₹" + discount);

        System.out.println(
                "Final Amount : ₹" + finalAmount);

        // -----------------------------------------------------
        // 8. CREATE ORDER
        // -----------------------------------------------------

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(finalAmount)
                .build();

        Order savedOrder =
                orderRepository.save(order);

        System.out.println(
                "✅ Order Saved : "
                        + savedOrder.getId());

        // -----------------------------------------------------
        // 9. COPY CART ITEMS TO ORDER ITEMS
        // -----------------------------------------------------

        List<OrderItem> orderItems =
                new ArrayList<>();

        for (CartItem cartItem :
                cart.getItems()) {

            OrderItem orderItem =
                    OrderItem.builder()
                            .order(savedOrder)
                            .food(cartItem.getFood())
                            .foodName(
                                    cartItem.getFood().getName())
                            .price(cartItem.getPrice())
                            .quantity(cartItem.getQuantity())
                            .subtotal(cartItem.getSubtotal())
                            .build();

            OrderItem savedOrderItem =
                    orderItemRepository.save(orderItem);

            orderItems.add(savedOrderItem);

            System.out.println(
                    "✅ Order Item Saved : "
                            + cartItem.getFood().getName());
        }

        // -----------------------------------------------------
        // 10. ADD ITEMS TO ORDER
        // -----------------------------------------------------

        savedOrder.setItems(orderItems);

        System.out.println(
                "Total Order Items : "
                        + orderItems.size());

        // -----------------------------------------------------
        // 11. CLEAR CART
        // -----------------------------------------------------

        System.out.println(
                "➡️ BEFORE CART DELETE");

        try {

            cartItemRepository.deleteAll(
                    cart.getItems());

            System.out.println(
                    "➡️ AFTER CART DELETE");

        } catch (Exception e) {

            System.out.println(
                    "❌ CART DELETE ERROR : "
                            + e.getMessage());

            throw e;
        }

        // -----------------------------------------------------
        // 12. CLEAR CART COLLECTION
        // -----------------------------------------------------

        System.out.println(
                "➡️ BEFORE CART COLLECTION CLEAR");

        cart.getItems().clear();

        System.out.println(
                "➡️ AFTER CART COLLECTION CLEAR");

        // -----------------------------------------------------
        // 13. RESET CART TOTAL
        // -----------------------------------------------------

        cart.setTotalAmount(
                BigDecimal.ZERO);

        System.out.println(
                "➡️ CART TOTAL RESET");

        // -----------------------------------------------------
        // 14. SAVE CART
        // -----------------------------------------------------

        System.out.println(
                "➡️ BEFORE CART SAVE");

        try {

            cartRepository.save(cart);

            System.out.println(
                    "➡️ AFTER CART SAVE");

        } catch (Exception e) {

            System.out.println(
                    "❌ CART SAVE ERROR : "
                            + e.getMessage());

            throw e;
        }

        System.out.println(
                "✅ Cart Cleared");

        // -----------------------------------------------------
        // 15. SEND CONFIRMATION EMAIL
        // -----------------------------------------------------

        try {

            System.out.println(
                    "➡️ Sending confirmation email...");

            emailService.sendOrderConfirmationEmail(
                    user.getEmail(),
                    savedOrder.getId(),
                    savedOrder
                            .getTotalAmount()
                            .doubleValue()
            );

            System.out.println(
                    "✅ Confirmation Email Sent");

        } catch (Exception e) {

            /*
             * Email failure should NOT cancel the order.
             *
             * Order is already saved and cart is already
             * cleared, so only log the email problem.
             */

            System.out.println(
                    "⚠️ EMAIL FAILED : "
                            + e.getMessage());

            System.out.println(
                    "⚠️ Order will still be completed.");
        }

        // -----------------------------------------------------
        // 16. RESPONSE
        // -----------------------------------------------------

        System.out.println(
                "================================");

        System.out.println(
                "✅ PLACE ORDER COMPLETED");

        System.out.println(
                "Order ID : "
                        + savedOrder.getId());

        System.out.println(
                "Amount : ₹"
                        + savedOrder.getTotalAmount());

        System.out.println(
                "================================");

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

    public List<OrderResponse> getMyOrders(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        return orderRepository
                .findByUser(user)
                .stream()
                .map(OrderMapper::toOrderResponse)
                .toList();
    }

    // =========================================================
    // GET ORDER BY ID
    // =========================================================

    public OrderResponse getOrderById(
            Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"));

        return OrderMapper.toOrderResponse(order);
    }

    // =========================================================
    // CANCEL ORDER
    // =========================================================

    @Transactional
    public OrderResponse cancelOrder(
            Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"));

        order.setOrderStatus(
                OrderStatus.CANCELLED);

        Order updatedOrder =
                orderRepository.save(order);

        return OrderMapper.toOrderResponse(
                updatedOrder);
    }
}