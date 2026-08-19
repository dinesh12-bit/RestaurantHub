package com.restauranthub.controller;

import com.restauranthub.dto.request.AdminFoodRequest;
import com.restauranthub.dto.response.AdminFoodResponse;
import com.restauranthub.service.AdminFoodService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.restauranthub.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/foods")
public class AdminFoodController {

    private final AdminFoodService adminFoodService;

    private final CloudinaryService cloudinaryService;

    public AdminFoodController(
            AdminFoodService adminFoodService,
            CloudinaryService cloudinaryService) {

        this.adminFoodService = adminFoodService;
        this.cloudinaryService = cloudinaryService;
    }


    // =====================================================
    // ADD FOOD
    // =====================================================

    @PostMapping
    public ResponseEntity<AdminFoodResponse> addFood(

            @Valid
            @RequestBody
            AdminFoodRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        adminFoodService.addFood(request)
                );
    }


    // =====================================================
    // GET ALL FOODS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<AdminFoodResponse>>
    getAllFoods() {

        return ResponseEntity.ok(
                adminFoodService.getAllFoods()
        );
    }


    // =====================================================
    // GET FOOD BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<AdminFoodResponse>
    getFoodById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminFoodService.getFoodById(id)
        );
    }


    // =====================================================
    // UPDATE FOOD
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<AdminFoodResponse>
    updateFood(

            @PathVariable Long id,

            @Valid
            @RequestBody
            AdminFoodRequest request) {

        return ResponseEntity.ok(
                adminFoodService.updateFood(
                        id,
                        request
                )
        );
    }


    // =====================================================
    // DELETE FOOD
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteFood(
            @PathVariable Long id) {

        adminFoodService.deleteFood(id);

        return ResponseEntity.ok(
                "Food deleted successfully"
        );
    }


    // =====================================================
    // TOGGLE AVAILABILITY
    // =====================================================

    @PatchMapping("/{id}/availability")
    public ResponseEntity<AdminFoodResponse>
    toggleAvailability(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminFoodService.toggleAvailability(id)
        );
    }

    // =====================================================
// UPLOAD FOOD IMAGE
// =====================================================

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadFoodImage(
            @RequestParam("file") MultipartFile file) {

        try {

            String imageUrl =
                    cloudinaryService.uploadImage(file);

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }
}