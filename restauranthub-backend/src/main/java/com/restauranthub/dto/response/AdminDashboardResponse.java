package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class AdminDashboardResponse {

    private long totalUsers;

    private long totalFoods;

    private long totalCategories;

    private long totalOrders;

    private BigDecimal totalRevenue;

    private long pendingOrders;

    private long confirmedOrders;

    private long preparingOrders;

    private long outForDeliveryOrders;

    private long deliveredOrders;

    private long cancelledOrders;
}