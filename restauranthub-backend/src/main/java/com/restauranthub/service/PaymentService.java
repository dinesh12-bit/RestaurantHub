package com.restauranthub.service;

import com.restauranthub.dto.request.VerifyPaymentRequest;
import com.restauranthub.dto.response.PaymentResponse;
import com.restauranthub.entity.Order;
import com.restauranthub.entity.enums.PaymentStatus;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final OrderRepository orderRepository;


    public PaymentService(
            OrderRepository orderRepository) {

        this.orderRepository =
                orderRepository;
    }


    // =====================================================
    // CREATE PAYMENT
    // =====================================================

    public PaymentResponse createPayment(
            Long orderId)
            throws RazorpayException {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );


        // ---------------------------------------------
        // CHECK ORDER TOTAL
        // ---------------------------------------------

        if (order.getTotalAmount() == null ||
                order.getTotalAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Invalid order amount"
            );
        }


        // ---------------------------------------------
        // CREATE RAZORPAY CLIENT
        // ---------------------------------------------

        RazorpayClient razorpay =
                new RazorpayClient(
                        keyId,
                        keySecret
                );


        // ---------------------------------------------
        // AMOUNT IN PAISE
        // ---------------------------------------------

        int amountInPaise =
                order.getTotalAmount()
                        .multiply(
                                BigDecimal.valueOf(100)
                        )
                        .intValue();


        JSONObject options =
                new JSONObject();

        options.put(
                "amount",
                amountInPaise
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "order_" + order.getId()
        );


        // ---------------------------------------------
        // CREATE RAZORPAY ORDER
        // ---------------------------------------------

        com.razorpay.Order razorpayOrder =
                razorpay.orders.create(
                        options
                );


        String razorpayOrderId =
                razorpayOrder.get("id");


        System.out.println(
                "===== RAZORPAY ORDER CREATED ====="
        );

        System.out.println(
                "RestaurantHub Order ID : "
                        + order.getId()
        );

        System.out.println(
                "Razorpay Order ID      : "
                        + razorpayOrderId
        );

        System.out.println(
                "Amount                 : "
                        + amountInPaise
                        + " paise"
        );


        return PaymentResponse.builder()

                .orderId(
                        order.getId().toString()
                )

                .razorpayOrderId(
                        razorpayOrderId
                )

                .amount(
                        amountInPaise
                )

                .currency(
                        "INR"
                )

                .key(
                        keyId
                )

                .build();
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    public String verifyPayment(
            VerifyPaymentRequest request)
            throws RazorpayException {


        // ---------------------------------------------
        // VALIDATE REQUEST
        // ---------------------------------------------

        if (request == null ||
                request.getOrderId() == null ||
                request.getRazorpayOrderId() == null ||
                request.getRazorpayPaymentId() == null ||
                request.getRazorpaySignature() == null) {

            throw new IllegalArgumentException(
                    "Invalid payment verification request"
            );
        }


        // ---------------------------------------------
        // FIND ORDER
        // ---------------------------------------------

        Order order =
                orderRepository.findById(
                                request.getOrderId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );


        // ---------------------------------------------
        // DEBUG
        // ---------------------------------------------

        System.out.println(
                "======================================"
        );

        System.out.println(
                "===== PAYMENT VERIFY ====="
        );

        System.out.println(
                "Order ID       : "
                        + request.getOrderId()
        );

        System.out.println(
                "Razorpay Order : "
                        + request.getRazorpayOrderId()
        );

        System.out.println(
                "Payment ID     : "
                        + request.getRazorpayPaymentId()
        );

        System.out.println(
                "Signature      : "
                        + request.getRazorpaySignature()
        );


        // ---------------------------------------------
        // PREVENT DUPLICATE SUCCESS
        // ---------------------------------------------

        if (order.getPaymentStatus()
                == PaymentStatus.SUCCESS) {

            System.out.println(
                    "Payment already verified."
            );

            return "Payment verified successfully";
        }


        // ---------------------------------------------
        // VERIFY RAZORPAY SIGNATURE
        // ---------------------------------------------

        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                request.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                request.getRazorpaySignature()
        );


        System.out.println(
                "Verifying Razorpay signature..."
        );


        boolean verified =
                Utils.verifyPaymentSignature(
                        options,
                        keySecret
                );


        System.out.println(
                "Verification Result : "
                        + verified
        );


        // ---------------------------------------------
        // PAYMENT FAILED
        // ---------------------------------------------

        if (!verified) {

            order.setPaymentStatus(
                    PaymentStatus.FAILED
            );

            orderRepository.save(order);


            System.out.println(
                    "Payment Status Updated To FAILED"
            );

            return "Payment verification failed";
        }


        // ---------------------------------------------
        // PAYMENT SUCCESS
        // ---------------------------------------------

        order.setPaymentStatus(
                PaymentStatus.SUCCESS
        );

        orderRepository.save(order);


        System.out.println(
                "Payment Status Updated To SUCCESS"
        );

        System.out.println(
                "======================================"
        );


        return "Payment verified successfully";
    }
}