package com.github.av2.api.controller;

import com.github.av2.api.dto.cart.CartItemQuantityUpdateRequest;
import com.github.av2.api.dto.cart.CartItemRequest;
import com.github.av2.api.dto.cart.CartResponse;
import com.github.av2.api.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "API endpoints for managing shopping carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{sessionId}")
    @Operation(summary = "Retrieve cart contents")
    public ResponseEntity<CartResponse> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/{sessionId}/items")
    @Operation(summary = "Add an item to the cart")
    @ApiResponse(responseCode = "201", description = "Cart item added successfully")
    public ResponseEntity<CartResponse> addItem(
            @PathVariable String sessionId,
            @Valid @RequestBody CartItemRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addItem(sessionId, request));
    }

    @PutMapping("/{sessionId}/items/{itemId}")
    @Operation(summary = "Update an item quantity in the cart")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable String sessionId,
            @PathVariable Integer itemId,
            @Valid @RequestBody CartItemQuantityUpdateRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(sessionId, itemId, request));
    }

    @DeleteMapping("/{sessionId}/items/{itemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<CartResponse> removeItem(@PathVariable String sessionId, @PathVariable Integer itemId) {
        return ResponseEntity.ok(cartService.removeItem(sessionId, itemId));
    }

    @DeleteMapping("/{sessionId}")
    @Operation(summary = "Clear the cart")
    public ResponseEntity<CartResponse> clearCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.clearCart(sessionId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationFailure(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Validation failed.")
                .orElse("Validation failed.");

        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
