package com.restauranthub.service;

import com.restauranthub.dto.response.AdminSalesResponse;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.entity.enums.PaymentStatus;
import com.restauranthub.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminSalesService {

    private final OrderRepository orderRepository;

    public AdminSalesService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    public AdminSalesResponse getSalesSummary() {

        LocalDate today = LocalDate.now();

        LocalDate firstDayOfMonth =
                today.withDayOfMonth(1);

        LocalDate firstDayOfNextMonth =
                firstDayOfMonth.plusMonths(1);


        LocalDateTime todayStart =
                today.atStartOfDay();

        LocalDateTime tomorrowStart =
                today.plusDays(1).atStartOfDay();

        LocalDateTime monthStart =
                firstDayOfMonth.atStartOfDay();

        LocalDateTime nextMonthStart =
                firstDayOfNextMonth.atStartOfDay();


        // ---------------------------------------------
        // Total orders
        // ---------------------------------------------

        long totalOrders =
                orderRepository.count();


        // ---------------------------------------------
        // Total successful revenue
        // ---------------------------------------------

        BigDecimal totalRevenue =
                orderRepository.getRevenueByPaymentStatus(
                        PaymentStatus.SUCCESS
                );

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }


        // ---------------------------------------------
        // Today's sales
        // ---------------------------------------------

        BigDecimal todaySales =
                orderRepository.getRevenueBetweenDates(
                        PaymentStatus.SUCCESS,
                        todayStart,
                        tomorrowStart
                );

        if (todaySales == null) {
            todaySales = BigDecimal.ZERO;
        }


        // ---------------------------------------------
        // Monthly sales
        // ---------------------------------------------

        BigDecimal monthlySales =
                orderRepository.getRevenueBetweenDates(
                        PaymentStatus.SUCCESS,
                        monthStart,
                        nextMonthStart
                );

        if (monthlySales == null) {
            monthlySales = BigDecimal.ZERO;
        }


        // ---------------------------------------------
        // Successful payments
        // ---------------------------------------------

        long successfulPayments =
                orderRepository.countByPaymentStatus(
                        PaymentStatus.SUCCESS
                );


        // ---------------------------------------------
        // Pending payments
        // ---------------------------------------------

        long pendingPayments =
                orderRepository.countByPaymentStatus(
                        PaymentStatus.PENDING
                );


        // ---------------------------------------------
        // Cancelled orders
        // ---------------------------------------------

        long cancelledOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.CANCELLED
                );


        // ---------------------------------------------
        // Average order value
        // ---------------------------------------------

        BigDecimal averageOrderValue =
                BigDecimal.ZERO;

        if (successfulPayments > 0) {

            averageOrderValue =
                    totalRevenue.divide(
                            BigDecimal.valueOf(
                                    successfulPayments
                            ),
                            2,
                            RoundingMode.HALF_UP
                    );
        }


        // ---------------------------------------------
        // Daily revenue
        // ---------------------------------------------

        List<Object[]> rows =
                orderRepository.getDailyRevenue(
                        PaymentStatus.SUCCESS.name(),
                        monthStart,
                        nextMonthStart
                );


        Map<LocalDate, BigDecimal> revenueByDate =
                new HashMap<>();


        for (Object[] row : rows) {

            LocalDate date =
                    convertDate(row[0]);

            BigDecimal revenue =
                    convertAmount(row[1]);

            revenueByDate.put(
                    date,
                    revenue
            );
        }


        List<AdminSalesResponse.DailyRevenue>
                dailyRevenue =
                new ArrayList<>();


        LocalDate date = firstDayOfMonth;

        while (date.isBefore(firstDayOfNextMonth)) {

            BigDecimal revenue =
                    revenueByDate.getOrDefault(
                            date,
                            BigDecimal.ZERO
                    );


            dailyRevenue.add(
                    AdminSalesResponse.DailyRevenue
                            .builder()
                            .date(date)
                            .revenue(revenue)
                            .build()
            );

            date = date.plusDays(1);
        }


        // ---------------------------------------------
        // Return response
        // ---------------------------------------------

        return AdminSalesResponse.builder()

                .totalRevenue(totalRevenue)

                .totalOrders(totalOrders)

                .todaySales(todaySales)

                .monthlySales(monthlySales)

                .successfulPayments(
                        successfulPayments
                )

                .pendingPayments(
                        pendingPayments
                )

                .cancelledOrders(
                        cancelledOrders
                )

                .averageOrderValue(
                        averageOrderValue
                )

                .dailyRevenue(
                        dailyRevenue
                )

                .build();
    }


    private LocalDate convertDate(Object value) {

        if (value instanceof java.sql.Date) {

            return ((java.sql.Date) value)
                    .toLocalDate();
        }

        if (value instanceof LocalDate) {
            return (LocalDate) value;
        }

        return LocalDate.parse(
                value.toString()
        );
    }


    private BigDecimal convertAmount(Object value) {

        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }

        return new BigDecimal(
                value.toString()
        );
    }
}