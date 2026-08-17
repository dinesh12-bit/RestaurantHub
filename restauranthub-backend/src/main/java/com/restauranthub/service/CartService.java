package com.restauranthub.service;

import com.restauranthub.dto.request.AddToCartRequest;
import com.restauranthub.dto.response.CartResponse;
import com.restauranthub.entity.Cart;
import com.restauranthub.entity.CartItem;
import com.restauranthub.entity.Food;
import com.restauranthub.entity.User;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.CartMapper;
import com.restauranthub.repository.CartItemRepository;
import com.restauranthub.repository.CartRepository;
import com.restauranthub.repository.FoodRepository;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            FoodRepository foodRepository,
            UserRepository userRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.foodRepository = foodRepository;
        this.userRepository = userRepository;
    }

    private Cart getOrCreateCart(User user) {

        return cartRepository.findByUser(user)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .user(user)
                            .totalAmount(BigDecimal.ZERO)
                            .build();

                    return cartRepository.save(cart);
                });
    }

    private void updateCartTotal(Cart cart) {

        BigDecimal total = cart.getItems()
                .stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);

        cartRepository.save(cart);
    }

    public CartResponse addToCart(Long userId, AddToCartRequest request) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Get or Create Cart
        Cart cart = getOrCreateCart(user);

        // Find Food
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        // Check if Food already exists in Cart
        CartItem cartItem = cartItemRepository
                .findByCartAndFood(cart, food)
                .orElse(null);

        if (cartItem != null) {

            // Increase Quantity
            cartItem.setQuantity(
                    cartItem.getQuantity() + request.getQuantity()
            );

            cartItem.setSubtotal(
                    cartItem.getPrice().multiply(
                            BigDecimal.valueOf(cartItem.getQuantity())
                    )
            );

        } else {

            // Create New Cart Item
            cartItem = CartItem.builder()
                    .cart(cart)
                    .food(food)
                    .quantity(request.getQuantity())
                    .price(food.getPrice())
                    .subtotal(
                            food.getPrice().multiply(
                                    BigDecimal.valueOf(request.getQuantity())
                            )
                    )
                    .build();

            cart.getItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);

        updateCartTotal(cart);

        return CartMapper.toCartResponse(cart);
    }

    public CartResponse getCart(Long userId) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Get existing cart OR create new empty cart
        Cart cart = getOrCreateCart(user);

        // Update total
        updateCartTotal(cart);

        return CartMapper.toCartResponse(cart);
    }
    public CartResponse updateQuantity(
            Long userId,
            Long foodId,
            Integer quantity) {

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        // Find Cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cart not found"
                        ));

        // Find Food
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"
                        ));

        // Find Cart Item
        CartItem cartItem = cartItemRepository
                .findByCartAndFood(cart, food)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found in cart"
                        ));

        // Update Quantity
        cartItem.setQuantity(quantity);

        // Recalculate Subtotal
        cartItem.setSubtotal(
                cartItem.getPrice()
                        .multiply(
                                BigDecimal.valueOf(quantity)
                        )
        );

        cartItemRepository.save(cartItem);

        // Recalculate Cart Total
        updateCartTotal(cart);

        return CartMapper.toCartResponse(cart);
    }

    public void removeItem(Long userId, Long foodId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        CartItem cartItem = cartItemRepository
                .findByCartAndFood(cart, food)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found in cart"));

        cart.getItems().remove(cartItem);

        cartItemRepository.delete(cartItem);

        updateCartTotal(cart);
    }

    public void clearCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        cartItemRepository.deleteAll(cart.getItems());

        cart.getItems().clear();

        cart.setTotalAmount(BigDecimal.ZERO);

        cartRepository.save(cart);
    }
}