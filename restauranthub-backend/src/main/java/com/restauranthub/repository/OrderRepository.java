/*
 * RestaurantHub
 * Order Repository
 */

package com.restauranthub.repository;

import com.restauranthub.entity.Order;
import com.restauranthub.entity.User;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {


    // =====================================================
    // CUSTOMER ORDERS
    // =====================================================

    List<Order> findByUser(User user);


    // =====================================================
    // ADMIN ORDERS
    // Latest orders first
    // =====================================================

    List<Order> findAllByOrderByOrderDateDesc();


    // =====================================================
    // ORDER STATUS COUNT
    // =====================================================

    long countByOrderStatus(
            OrderStatus orderStatus
    );


    // =====================================================
    // REVENUE BY ORDER STATUS
    // =====================================================

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.orderStatus = :status
            """)
    BigDecimal getRevenueByStatus(
            @Param("status")
            OrderStatus status
    );


    // =====================================================
    // TOTAL REVENUE
    //
    // IMPORTANT:
    // Revenue is based on successful payments.
    // Order does NOT need to be DELIVERED.
    //
    // This matches the revenue shown on the
    // Admin Orders page.
    // =====================================================

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.paymentStatus =
                com.restauranthub.entity.enums.PaymentStatus.SUCCESS
            """)
    BigDecimal getTotalRevenue();


    // =====================================================
    // REVENUE BY PAYMENT STATUS
    // =====================================================

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.paymentStatus = :paymentStatus
            """)
    BigDecimal getRevenueByPaymentStatus(
            @Param("paymentStatus")
            PaymentStatus paymentStatus
    );


    // =====================================================
    // COUNT PAYMENTS BY PAYMENT STATUS
    // =====================================================

    long countByPaymentStatus(
            PaymentStatus paymentStatus
    );


    // =====================================================
    // REVENUE BETWEEN TWO DATES
    // =====================================================

    @Query("""
            SELECT COALESCE(SUM(o.totalAmount), 0)
            FROM Order o
            WHERE o.paymentStatus = :paymentStatus
            AND o.orderDate >= :startDate
            AND o.orderDate < :endDate
            """)
    BigDecimal getRevenueBetweenDates(
            @Param("paymentStatus")
            PaymentStatus paymentStatus,

            @Param("startDate")
            LocalDateTime startDate,

            @Param("endDate")
            LocalDateTime endDate
    );


    // =====================================================
    // DAILY REVENUE FOR CURRENT MONTH
    // =====================================================

    @Query(value = """
            SELECT
                DATE(order_date) AS sale_date,
                COALESCE(SUM(total_amount), 0) AS revenue
            FROM orders
            WHERE payment_status = :paymentStatus
            AND order_date >= :startDate
            AND order_date < :endDate
            GROUP BY DATE(order_date)
            ORDER BY DATE(order_date)
            """,
            nativeQuery = true)
    List<Object[]> getDailyRevenue(
            @Param("paymentStatus")
            String paymentStatus,

            @Param("startDate")
            LocalDateTime startDate,

            @Param("endDate")
            LocalDateTime endDate
    );
}