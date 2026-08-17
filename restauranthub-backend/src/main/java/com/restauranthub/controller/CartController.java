package com.restauranthub.controller;

import com.restauranthub.dto.request.AddToCartRequest;
import com.restauranthub.dto.response.CartResponse;
import com.restauranthub.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add Food To Cart
    @PostMapping("/{userId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable Long userId,
            @Valid @RequestBody AddToCartRequest request) {

        return ResponseEntity.ok(
                cartService.addToCart(userId, request)
        );
    }

    // Get User Cart
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(
            @PathVariable Long userId) {
        System.out.println("🔥 CART CONTROLLER HIT - USER ID = " + userId);
        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    // Update Cart Item Quantity
    @PatchMapping("/{userId}/{foodId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long foodId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.updateQuantity(
                        userId,
                        foodId,
                        quantity
                )
        );
    }

    // Remove Item From Cart
    @DeleteMapping("/{userId}/{foodId}")
    public ResponseEntity<String> removeItem(
            @PathVariable Long userId,
            @PathVariable Long foodId) {

        cartService.removeItem(userId, foodId);

        return ResponseEntity.ok("Item removed from cart successfully");
    }

    // Clear Cart
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> clearCart(
            @PathVariable Long userId) {

        cartService.clearCart(userId);

        return ResponseEntity.ok("Cart cleared successfully");
    }
}