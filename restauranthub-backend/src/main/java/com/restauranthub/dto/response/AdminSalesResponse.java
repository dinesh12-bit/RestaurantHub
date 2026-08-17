package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
public class AdminSalesResponse {

    private BigDecimal totalRevenue;

    private long totalOrders;

    private BigDecimal todaySales;

    private BigDecimal monthlySales;

    private long successfulPayments;

    private long pendingPayments;

    private long cancelledOrders;

    private BigDecimal averageOrderValue;

    private List<DailyRevenue> dailyRevenue;


    @Getter
    @Setter
    @Builder
    public static class DailyRevenue {

        private LocalDate date;

        private BigDecimal revenue;
    }
}