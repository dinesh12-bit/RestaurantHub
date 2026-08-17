package com.restauranthub.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmationEmail(
            String toEmail,
            Long orderId,
            Double totalAmount
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Restaurant Hub - Order Confirmed");

        message.setText(
                "Hello,\n\n" +
                        "Your order has been placed successfully.\n\n" +
                        "Order ID : " + orderId + "\n" +
                        "Total Amount : ₹" + totalAmount + "\n\n" +
                        "Thank you for ordering with Restaurant Hub."
        );

        mailSender.send(message);
    }
}