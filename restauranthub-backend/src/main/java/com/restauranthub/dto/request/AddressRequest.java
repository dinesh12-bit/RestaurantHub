package com.restauranthub.dto.request;

import com.restauranthub.entity.enums.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Address is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String landmark;

    @NotNull(message = "Address Type is required")
    private AddressType addressType;

    private Boolean defaultAddress;
}