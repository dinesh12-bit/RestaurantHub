package com.restauranthub.dto.response;

import com.restauranthub.entity.enums.AddressType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddressResponse {

    private Long id;

    private String fullName;

    private String mobile;

    private String addressLine;

    private String city;

    private String state;

    private String pincode;

    private String landmark;

    private AddressType addressType;

    private Boolean defaultAddress;
}