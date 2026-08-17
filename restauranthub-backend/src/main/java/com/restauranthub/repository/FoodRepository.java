package com.restauranthub.repository;

import com.restauranthub.entity.Category;
import com.restauranthub.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByCategory(Category category);

    List<Food> findByAvailableTrue();

    List<Food> findByNameContainingIgnoreCase(String keyword);
}