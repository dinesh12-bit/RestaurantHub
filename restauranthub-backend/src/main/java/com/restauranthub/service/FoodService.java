package com.restauranthub.service;

import com.restauranthub.dto.request.FoodRequest;
import com.restauranthub.dto.response.FoodResponse;
import com.restauranthub.entity.Category;
import com.restauranthub.entity.Food;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.FoodMapper;
import com.restauranthub.repository.CategoryRepository;
import com.restauranthub.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    public FoodService(FoodRepository foodRepository,
                       CategoryRepository categoryRepository) {

        this.foodRepository = foodRepository;
        this.categoryRepository = categoryRepository;
    }

    // Add Food
    public FoodResponse addFood(FoodRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        Food food = FoodMapper.toEntity(request, category);

        Food savedFood = foodRepository.save(food);

        FoodResponse response = FoodMapper.toResponse(savedFood);

// Debug
        System.out.println("========== FOOD RESPONSE ==========");
        System.out.println(response);
        System.out.println("Price : " + response.getPrice());
        System.out.println("Image : " + response.getImageUrl());
        System.out.println("Available : " + response.getAvailable());
        System.out.println("Category Id : " + response.getCategoryId());
        System.out.println("Category Name : " + response.getCategoryName());
        System.out.println("===================================");

        return response;
    }

    // Get All Foods
    public List<FoodResponse> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(FoodMapper::toResponse)
                .toList();
    }

    // Get Food By Id
    public FoodResponse getFoodById(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        return FoodMapper.toResponse(food);
    }

    // Get Foods By Category
    public List<FoodResponse> getFoodsByCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        return foodRepository.findByCategory(category)
                .stream()
                .map(FoodMapper::toResponse)
                .toList();
    }



    // Search Food
    public List<FoodResponse> searchFood(String keyword) {

        return foodRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(FoodMapper::toResponse)
                .toList();
    }

    // Delete Food
    public void deleteFood(Long id) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        foodRepository.delete(food);
    }
}