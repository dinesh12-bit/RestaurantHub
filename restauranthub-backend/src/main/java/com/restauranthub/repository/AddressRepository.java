package com.restauranthub.repository;

import com.restauranthub.entity.Address;
import com.restauranthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);

    Optional<Address> findByUserAndDefaultAddressTrue(User user);
}