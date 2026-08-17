package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResponse {

    private Long id;

    private Long foodId;

    private String foodName;

    private Long userId;

    private String userName;

    private Long orderId;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}