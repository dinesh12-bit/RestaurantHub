package com.restauranthub.repository;

import com.restauranthub.entity.Food;
import com.restauranthub.entity.Review;
import com.restauranthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByFood(Food food);

    List<Review> findByUser(User user);

    List<Review> findByUserOrderByCreatedAtDesc(User user);

    Optional<Review> findByUserAndFood(User user, Food food);

    boolean existsByUserAndFood(User user, Food food);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0)
        FROM Review r
        WHERE r.food.id = :foodId
        """)
    Double getAverageRating(@Param("foodId") Long foodId);

    long countByFood(Food food);
}