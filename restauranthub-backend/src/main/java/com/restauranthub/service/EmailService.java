package com.restauranthub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    private final HttpClient httpClient =
            HttpClient.newBuilder().build();

    @Async("emailTaskExecutor")
    public void sendOrderConfirmationEmail(
            String toEmail,
            Long orderId,
            Double totalAmount
    ) {

        try {

            System.out.println("================================");
            System.out.println("📧 RESEND EMAIL STARTED");
            System.out.println("📧 Email : " + toEmail);
            System.out.println("📧 Order ID : " + orderId);
            System.out.println("================================");

            if (resendApiKey == null ||
                    resendApiKey.isBlank()) {

                System.out.println(
                        "❌ RESEND_API_KEY is missing"
                );

                return;
            }

            String subject =
                    "Restaurant Hub - Order Confirmed";

            String text =
                    "Hello,\n\n" +
                            "Your order has been placed successfully.\n\n" +
                            "Order ID : " + orderId + "\n" +
                            "Total Amount : ₹" + totalAmount + "\n\n" +
                            "Thank you for ordering with Restaurant Hub.";

            String jsonBody =
                    "{"
                            + "\"from\":\"Restaurant Hub <onboarding@resend.dev>\","
                            + "\"to\":[\"" + escapeJson(toEmail) + "\"],"
                            + "\"subject\":\"" + escapeJson(subject) + "\","
                            + "\"text\":\"" + escapeJson(text) + "\""
                            + "}";

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(
                                    "https://api.resend.com/emails"
                            ))
                            .header(
                                    "Authorization",
                                    "Bearer " + resendApiKey
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .header(
                                    "User-Agent",
                                    "RestaurantHub/1.0"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(jsonBody)
                            )
                            .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            System.out.println(
                    "📧 Resend HTTP Status : "
                            + response.statusCode()
            );

            System.out.println(
                    "📧 Resend Response : "
                            + response.body()
            );

            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                System.out.println(
                        "✅ RESEND EMAIL SENT SUCCESSFULLY"
                );

            } else {

                System.out.println(
                        "❌ RESEND EMAIL FAILED"
                );
            }

            System.out.println("================================");

        } catch (Exception e) {

            System.out.println(
                    "❌ RESEND EMAIL EXCEPTION"
            );

            System.out.println(
                    "❌ Email : " + toEmail
            );

            System.out.println(
                    "❌ Order ID : " + orderId
            );

            System.out.println(
                    "❌ Reason : " + e.getMessage()
            );

            System.out.println("================================");

            // Email failure must NOT affect the order.
        }
    }

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}