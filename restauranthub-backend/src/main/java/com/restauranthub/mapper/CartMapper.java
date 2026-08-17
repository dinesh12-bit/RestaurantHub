package com.restauranthub.mapper;

import com.restauranthub.dto.response.CartItemResponse;
import com.restauranthub.dto.response.CartResponse;
import com.restauranthub.entity.Cart;
import com.restauranthub.entity.CartItem;

import java.util.List;

public class CartMapper {

    // CartItem -> CartItemResponse
    public static CartItemResponse toCartItemResponse(CartItem cartItem) {

        return CartItemResponse.builder()
                .foodId(cartItem.getFood().getId())
                .foodName(cartItem.getFood().getName())
                .imageUrl(cartItem.getFood().getImageUrl())
                .price(cartItem.getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(cartItem.getSubtotal())
                .build();
    }

    // Cart -> CartResponse
    public static CartResponse toCartResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(CartMapper::toCartItemResponse)
                .toList();

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(cart.getTotalAmount())
                .build();
    }
}