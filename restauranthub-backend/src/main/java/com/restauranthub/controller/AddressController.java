package com.restauranthub.controller;

import com.restauranthub.dto.request.AddressRequest;
import com.restauranthub.dto.response.AddressResponse;
import com.restauranthub.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Add Address
    @PostMapping("/{userId}")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.addAddress(userId, request));
    }

    // Get All Addresses
    @GetMapping("/{userId}")
    public ResponseEntity<List<AddressResponse>> getAllAddresses(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                addressService.getAllAddresses(userId)
        );
    }

    // Get Address By Id
    @GetMapping("/details/{id}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                addressService.getAddressById(id)
        );
    }

    // Update Address
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {

        return ResponseEntity.ok(
                addressService.updateAddress(id, request)
        );
    }

    // Delete Address
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long id) {

        addressService.deleteAddress(id);

        return ResponseEntity.ok("Address deleted successfully");
    }

    // Set Default Address
    @PatchMapping("/{id}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                addressService.setDefaultAddress(id)
        );
    }
}