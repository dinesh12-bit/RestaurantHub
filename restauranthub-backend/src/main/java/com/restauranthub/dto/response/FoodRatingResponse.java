package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FoodRatingResponse {

    private Long foodId;

    private String foodName;

    private Double averageRating;

    private Long reviewCount;
}