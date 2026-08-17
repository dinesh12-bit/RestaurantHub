package com.restauranthub.mapper;

import com.restauranthub.dto.request.AddressRequest;
import com.restauranthub.dto.response.AddressResponse;
import com.restauranthub.entity.Address;
import com.restauranthub.entity.User;

public class AddressMapper {

    // Request DTO -> Entity
    public static Address toEntity(AddressRequest request, User user) {

        return Address.builder()
                .fullName(request.getFullName())
                .mobile(request.getMobile())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .landmark(request.getLandmark())
                .addressType(request.getAddressType())
                .defaultAddress(request.getDefaultAddress())
                .user(user)
                .build();
    }

    // Entity -> Response DTO
    public static AddressResponse toResponse(Address address) {

        return AddressResponse.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .mobile(address.getMobile())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .landmark(address.getLandmark())
                .addressType(address.getAddressType())
                .defaultAddress(address.getDefaultAddress())
                .build();
    }
}