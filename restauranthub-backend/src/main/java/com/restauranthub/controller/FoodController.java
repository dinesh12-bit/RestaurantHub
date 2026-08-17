package com.restauranthub.controller;

import com.restauranthub.dto.request.FoodRequest;
import com.restauranthub.dto.response.FoodResponse;
import com.restauranthub.entity.Food;
import com.restauranthub.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    // Add Food
    @PostMapping
    public ResponseEntity<FoodResponse> addFood(
            @Valid @RequestBody FoodRequest request) {

        System.out.println("******** FOOD API CALLED ********");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foodService.addFood(request));
    }

    // Get All Foods
    @GetMapping
    public ResponseEntity<List<FoodResponse>> getAllFoods() {

        return ResponseEntity.ok(foodService.getAllFoods());
    }

    // Get Food By Id
    @GetMapping("/{id}")
    public ResponseEntity<FoodResponse> getFoodById(
            @PathVariable Long id) {

        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    // Get Foods By Category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodResponse>> getFoodsByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                foodService.getFoodsByCategory(categoryId)
        );
    }

    // Search Food
    @GetMapping("/search")
    public ResponseEntity<List<FoodResponse>> searchFood(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                foodService.searchFood(keyword)
        );
    }

    // Delete Food
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(
            @PathVariable Long id) {

        foodService.deleteFood(id);

        return ResponseEntity.ok("Food deleted successfully");
    }
}