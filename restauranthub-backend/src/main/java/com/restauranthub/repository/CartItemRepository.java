package com.restauranthub.repository;

import com.restauranthub.entity.Cart;
import com.restauranthub.entity.CartItem;
import com.restauranthub.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartAndFood(Cart cart, Food food);
}