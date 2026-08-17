package com.restauranthub.mapper;

import com.restauranthub.dto.request.FoodRequest;
import com.restauranthub.dto.response.FoodResponse;
import com.restauranthub.entity.Category;
import com.restauranthub.entity.Food;

public class FoodMapper {

    // Request DTO -> Entity
    public static Food toEntity(FoodRequest request, Category category) {

        return Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.getAvailable())
                .category(category)
                .build();
    }

    // Entity -> Response DTO
    public static FoodResponse toResponse(Food food) {

        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .imageUrl(food.getImageUrl())
                .available(food.getAvailable())
                .categoryId(food.getCategory().getId())
                .categoryName(food.getCategory().getName())
                .build();
    }
}