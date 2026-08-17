package com.restauranthub.service;

import com.restauranthub.dto.request.AdminFoodRequest;
import com.restauranthub.dto.response.AdminFoodResponse;
import com.restauranthub.entity.Category;
import com.restauranthub.entity.Food;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.CategoryRepository;
import com.restauranthub.repository.FoodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminFoodService {

    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    public AdminFoodService(
            FoodRepository foodRepository,
            CategoryRepository categoryRepository) {

        this.foodRepository = foodRepository;
        this.categoryRepository = categoryRepository;
    }


    // =====================================================
    // ADD FOOD
    // =====================================================

    @Transactional
    public AdminFoodResponse addFood(
            AdminFoodRequest request) {

        Category category =
                categoryRepository.findById(
                        request.getCategoryId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        )
                );


        Food food = Food.builder()

                .name(request.getName())

                .description(
                        request.getDescription()
                )

                .price(
                        request.getPrice()
                )

                .imageUrl(
                        request.getImageUrl()
                )

                .available(
                        request.getAvailable() == null
                                ? true
                                : request.getAvailable()
                )

                .category(category)

                .build();


        Food savedFood =
                foodRepository.save(food);


        return toResponse(savedFood);
    }


    // =====================================================
    // GET ALL FOODS
    // =====================================================

    public List<AdminFoodResponse> getAllFoods() {

        return foodRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET FOOD BY ID
    // =====================================================

    public AdminFoodResponse getFoodById(
            Long id) {

        Food food =
                foodRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Food not found"
                                )
                        );

        return toResponse(food);
    }


    // =====================================================
    // UPDATE FOOD
    // =====================================================

    @Transactional
    public AdminFoodResponse updateFood(
            Long id,
            AdminFoodRequest request) {

        Food food =
                foodRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Food not found"
                                )
                        );


        Category category =
                categoryRepository.findById(
                        request.getCategoryId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        )
                );


        food.setName(
                request.getName()
        );

        food.setDescription(
                request.getDescription()
        );

        food.setPrice(
                request.getPrice()
        );

        food.setImageUrl(
                request.getImageUrl()
        );

        food.setCategory(
                category
        );


        if (request.getAvailable() != null) {

            food.setAvailable(
                    request.getAvailable()
            );

        }


        Food updatedFood =
                foodRepository.save(food);


        return toResponse(updatedFood);
    }


    // =====================================================
    // DELETE FOOD
    // =====================================================

    @Transactional
    public void deleteFood(Long id) {

        Food food =
                foodRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Food not found"
                                )
                        );


        foodRepository.delete(food);
    }


    // =====================================================
    // TOGGLE AVAILABILITY
    // =====================================================

    @Transactional
    public AdminFoodResponse toggleAvailability(
            Long id) {

        Food food =
                foodRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Food not found"
                                )
                        );


        food.setAvailable(
                !Boolean.TRUE.equals(
                        food.getAvailable()
                )
        );


        Food updatedFood =
                foodRepository.save(food);


        return toResponse(updatedFood);
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private AdminFoodResponse toResponse(
            Food food) {

        return AdminFoodResponse.builder()

                .id(
                        food.getId()
                )

                .name(
                        food.getName()
                )

                .description(
                        food.getDescription()
                )

                .price(
                        food.getPrice()
                )

                .imageUrl(
                        food.getImageUrl()
                )

                .available(
                        food.getAvailable()
                )

                .categoryId(
                        food.getCategory() != null
                                ? food.getCategory().getId()
                                : null
                )

                .categoryName(
                        food.getCategory() != null
                                ? food.getCategory().getName()
                                : null
                )

                .build();
    }
}