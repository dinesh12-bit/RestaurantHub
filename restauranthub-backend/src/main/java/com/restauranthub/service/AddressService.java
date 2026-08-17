package com.restauranthub.service;

import com.restauranthub.dto.request.AddressRequest;
import com.restauranthub.dto.response.AddressResponse;
import com.restauranthub.entity.Address;
import com.restauranthub.entity.User;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.AddressMapper;
import com.restauranthub.repository.AddressRepository;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository,
                          UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public AddressResponse addAddress(Long userId,
                                      AddressRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // If new address is default,
        // remove previous default
        if (Boolean.TRUE.equals(request.getDefaultAddress())) {

            addressRepository.findByUserAndDefaultAddressTrue(user)
                    .ifPresent(address -> {

                        address.setDefaultAddress(false);

                        addressRepository.save(address);
                    });
        }

        Address address = AddressMapper.toEntity(request, user);

        Address savedAddress = addressRepository.save(address);

        return AddressMapper.toResponse(savedAddress);
    }

    public List<AddressResponse> getAllAddresses(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return addressRepository.findByUser(user)
                .stream()
                .map(AddressMapper::toResponse)
                .toList();
    }

    public AddressResponse getAddressById(Long id) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        return AddressMapper.toResponse(address);
    }

    public AddressResponse updateAddress(Long id,
                                         AddressRequest request) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        // Default address handling
        if (Boolean.TRUE.equals(request.getDefaultAddress())) {

            addressRepository.findByUserAndDefaultAddressTrue(address.getUser())
                    .ifPresent(defaultAddress -> {

                        if (!defaultAddress.getId().equals(address.getId())) {
                            defaultAddress.setDefaultAddress(false);
                            addressRepository.save(defaultAddress);
                        }
                    });
        }

        address.setFullName(request.getFullName());
        address.setMobile(request.getMobile());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setLandmark(request.getLandmark());
        address.setAddressType(request.getAddressType());
        address.setDefaultAddress(request.getDefaultAddress());

        Address updatedAddress = addressRepository.save(address);

        return AddressMapper.toResponse(updatedAddress);
    }

    public void deleteAddress(Long id) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
    }

    public AddressResponse setDefaultAddress(Long addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Address not found"));

        User user = address.getUser();

        addressRepository.findByUserAndDefaultAddressTrue(user)
                .ifPresent(defaultAddress -> {

                    defaultAddress.setDefaultAddress(false);
                    addressRepository.save(defaultAddress);
                });

        address.setDefaultAddress(true);

        Address updatedAddress = addressRepository.save(address);

        return AddressMapper.toResponse(updatedAddress);
    }
}