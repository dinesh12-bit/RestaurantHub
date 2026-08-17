package com.restauranthub.controller;

import com.restauranthub.dto.request.ReviewRequest;
import com.restauranthub.dto.response.FoodRatingResponse;
import com.restauranthub.dto.response.ReviewResponse;
import com.restauranthub.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService) {

        this.reviewService = reviewService;
    }


    // =====================================================
    // ADD REVIEW
    // =====================================================

    @PostMapping("/{userId}")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long userId,
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        reviewService.addReview(
                                userId,
                                request
                        )
                );
    }


    // =====================================================
    // GET REVIEWS BY FOOD
    // =====================================================

    @GetMapping("/food/{foodId}")
    public ResponseEntity<List<ReviewResponse>>
    getFoodReviews(
            @PathVariable Long foodId) {

        return ResponseEntity.ok(
                reviewService.getFoodReviews(
                        foodId
                )
        );
    }


    // =====================================================
    // GET FOOD RATING
    // =====================================================

    @GetMapping("/food/{foodId}/rating")
    public ResponseEntity<FoodRatingResponse>
    getFoodRating(
            @PathVariable Long foodId) {

        return ResponseEntity.ok(
                reviewService.getFoodRating(
                        foodId
                )
        );
    }


    // =====================================================
    // GET USER REVIEWS
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>>
    getUserReviews(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                reviewService.getUserReviews(
                        userId
                )
        );
    }


    // =====================================================
    // UPDATE REVIEW
    // =====================================================

    @PutMapping("/{userId}/{reviewId}")
    public ResponseEntity<ReviewResponse>
    updateReview(
            @PathVariable Long userId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity.ok(
                reviewService.updateReview(
                        userId,
                        reviewId,
                        request
                )
        );
    }


    // =====================================================
    // DELETE REVIEW
    // =====================================================

    @DeleteMapping("/{userId}/{reviewId}")
    public ResponseEntity<String>
    deleteReview(
            @PathVariable Long userId,
            @PathVariable Long reviewId) {

        reviewService.deleteReview(
                userId,
                reviewId
        );

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }
}