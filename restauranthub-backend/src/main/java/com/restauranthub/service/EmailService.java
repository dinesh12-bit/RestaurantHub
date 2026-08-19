package com.restauranthub.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("emailTaskExecutor")
    public void sendOrderConfirmationEmail(
            String toEmail,
            Long orderId,
            Double totalAmount
    ) {

        try {

            System.out.println(
                    "📧 EMAIL THREAD STARTED");

            System.out.println(
                    "📧 Sending email to : "
                            + toEmail);

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(toEmail);

            message.setSubject(
                    "Restaurant Hub - Order Confirmed");

            message.setText(
                    "Hello,\n\n" +
                            "Your order has been placed successfully.\n\n" +
                            "Order ID : " + orderId + "\n" +
                            "Total Amount : ₹" + totalAmount + "\n\n" +
                            "Thank you for ordering with Restaurant Hub."
            );

            mailSender.send(message);

            System.out.println(
                    "✅ Confirmation Email Sent");

        } catch (Exception e) {

            System.out.println(
                    "⚠️ EMAIL FAILED");

            System.out.println(
                    "⚠️ Email : " + toEmail);

            System.out.println(
                    "⚠️ Order ID : " + orderId);

            System.out.println(
                    "⚠️ Reason : " + e.getMessage());

            // IMPORTANT:
            // Email failure must NOT affect the order.
        }
    }
}