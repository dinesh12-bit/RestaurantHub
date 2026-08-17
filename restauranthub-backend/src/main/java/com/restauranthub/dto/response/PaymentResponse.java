package com.restauranthub.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentResponse {

    private String orderId;

    private String razorpayOrderId;

    private Integer amount;

    private String currency;

    private String key;
}