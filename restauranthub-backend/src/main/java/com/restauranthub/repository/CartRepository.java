package com.restauranthub.repository;

import com.restauranthub.entity.Cart;
import com.restauranthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);
}