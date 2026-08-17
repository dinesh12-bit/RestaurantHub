package com.restauranthub.mapper;

import com.restauranthub.dto.request.CategoryRequest;
import com.restauranthub.dto.response.CategoryResponse;
import com.restauranthub.entity.Category;

public class CategoryMapper {

    // Request DTO -> Entity
    public static Category toEntity(CategoryRequest request) {

        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();
    }

    // Entity -> Response DTO
    public static CategoryResponse toResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }
}