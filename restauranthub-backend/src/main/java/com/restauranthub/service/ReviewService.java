package com.restauranthub.service;

import com.restauranthub.dto.request.ReviewRequest;
import com.restauranthub.dto.response.FoodRatingResponse;
import com.restauranthub.dto.response.ReviewResponse;
import com.restauranthub.entity.Food;
import com.restauranthub.entity.Order;
import com.restauranthub.entity.Review;
import com.restauranthub.entity.User;
import com.restauranthub.entity.enums.OrderStatus;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.FoodRepository;
import com.restauranthub.repository.OrderRepository;
import com.restauranthub.repository.ReviewRepository;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            FoodRepository foodRepository,
            OrderRepository orderRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
    }


    // =====================================================
    // ADD REVIEW
    // =====================================================

    @Transactional
    public ReviewResponse addReview(
            Long userId,
            ReviewRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Food food = foodRepository.findById(
                        request.getFoodId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"
                        ));

        Order order = orderRepository.findById(
                        request.getOrderId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        ));


        // Order belongs to user
        if (!order.getUser()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You cannot review another user's order"
            );
        }


        // Only delivered orders can be reviewed
        if (order.getOrderStatus()
                != OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "You can review only delivered orders"
            );
        }


        // Check food belongs to order
        boolean foodExistsInOrder =
                order.getItems()
                        .stream()
                        .anyMatch(item ->
                                item.getFood()
                                        .getId()
                                        .equals(food.getId())
                        );

        if (!foodExistsInOrder) {

            throw new RuntimeException(
                    "This food was not part of the order"
            );
        }


        // Duplicate review
        if (reviewRepository
                .existsByUserAndFood(user, food)) {

            throw new RuntimeException(
                    "You have already reviewed this food"
            );
        }


        Review review = Review.builder()
                .user(user)
                .food(food)
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview =
                reviewRepository.save(review);

        return toResponse(savedReview);
    }


    // =====================================================
    // GET FOOD REVIEWS
    // =====================================================

    public List<ReviewResponse> getFoodReviews(
            Long foodId) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"
                        ));

        return reviewRepository
                .findByFood(food)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET FOOD RATING
    // =====================================================

    public FoodRatingResponse getFoodRating(
            Long foodId) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"
                        ));

        Double averageRating =
                reviewRepository
                        .getAverageRating(foodId);

        Long reviewCount =
                reviewRepository
                        .countByFood(food);

        return FoodRatingResponse.builder()
                .foodId(food.getId())
                .foodName(food.getName())
                .averageRating(averageRating)
                .reviewCount(reviewCount)
                .build();
    }


    // =====================================================
    // GET USER REVIEWS
    // =====================================================

    public List<ReviewResponse> getUserReviews(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return reviewRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // UPDATE REVIEW
    // =====================================================

    @Transactional
    public ReviewResponse updateReview(
            Long userId,
            Long reviewId,
            ReviewRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found"
                        ));


        // Security check
        if (!review.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You can update only your own review"
            );
        }


        // Update rating
        review.setRating(
                request.getRating()
        );

        // Update comment
        review.setComment(
                request.getComment()
        );


        Review updatedReview =
                reviewRepository.save(review);

        return toResponse(updatedReview);
    }


    // =====================================================
    // DELETE REVIEW
    // =====================================================

    @Transactional
    public void deleteReview(
            Long userId,
            Long reviewId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review not found"
                        ));


        // Security check
        if (!review.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You can delete only your own review"
            );
        }


        reviewRepository.delete(review);
    }


    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private ReviewResponse toResponse(
            Review review) {

        return ReviewResponse.builder()

                .id(review.getId())

                .foodId(
                        review.getFood().getId()
                )

                .foodName(
                        review.getFood().getName()
                )

                .userId(
                        review.getUser().getId()
                )

                .userName(
                        review.getUser().getFullName()
                )

                .orderId(
                        review.getOrder().getId()
                )

                .rating(
                        review.getRating()
                )

                .comment(
                        review.getComment()
                )

                .createdAt(
                        review.getCreatedAt()
                )

                .build();
    }
}