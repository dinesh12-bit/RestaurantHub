package com.restauranthub.service;

import com.restauranthub.dto.response.AdminDashboardResponse;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.repository.CategoryRepository;
import com.restauranthub.repository.FoodRepository;
import com.restauranthub.repository.OrderRepository;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            FoodRepository foodRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }


    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    public AdminDashboardResponse getDashboard() {

        long totalUsers =
                userRepository.count();

        long totalFoods =
                foodRepository.count();

        long totalCategories =
                categoryRepository.count();

        long totalOrders =
                orderRepository.count();


        // =================================================
        // ORDER STATUS COUNTS
        // =================================================

        long pendingOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.PLACED
                );

        long confirmedOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.CONFIRMED
                );

        long preparingOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.PREPARING
                );

        long outForDeliveryOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.OUT_FOR_DELIVERY
                );

        long deliveredOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.DELIVERED
                );

        long cancelledOrders =
                orderRepository.countByOrderStatus(
                        OrderStatus.CANCELLED
                );


        // =================================================
        // TOTAL REVENUE
        // =================================================

        BigDecimal totalRevenue =
                orderRepository.getTotalRevenue();

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }


        // =================================================
        // RESPONSE
        // =================================================

        return AdminDashboardResponse.builder()

                .totalUsers(totalUsers)

                .totalFoods(totalFoods)

                .totalCategories(totalCategories)

                .totalOrders(totalOrders)

                .totalRevenue(totalRevenue)

                .pendingOrders(pendingOrders)

                .confirmedOrders(confirmedOrders)

                .preparingOrders(preparingOrders)

                .outForDeliveryOrders(
                        outForDeliveryOrders
                )

                .deliveredOrders(
                        deliveredOrders
                )

                .cancelledOrders(
                        cancelledOrders
                )

                .build();
    }
}