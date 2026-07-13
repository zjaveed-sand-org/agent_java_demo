package com.github.av2.api.service;

import com.github.av2.api.dto.cart.CartItemQuantityUpdateRequest;
import com.github.av2.api.dto.cart.CartItemRequest;
import com.github.av2.api.dto.cart.CartItemResponse;
import com.github.av2.api.dto.cart.CartResponse;
import com.github.av2.api.model.Cart;
import com.github.av2.api.model.CartItem;
import com.github.av2.api.model.Product;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class CartService {
    private final Map<String, Cart> carts = new ConcurrentHashMap<>();
    private final AtomicInteger cartItemSequence = new AtomicInteger(1);
    private final ProductService productService;

    public CartService(ProductService productService) {
        this.productService = productService;
    }

    public CartResponse getCart(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        synchronized (cart) {
            return toResponse(cart);
        }
    }

    public CartResponse addItem(String sessionId, CartItemRequest request) {
        validateQuantity(request.getQuantity());

        Cart cart = getOrCreateCart(sessionId);
        synchronized (cart) {
            Product product = findProductOrThrow(request.getProductId());
            List<CartItem> updatedItems = new ArrayList<>(cart.getItems());
            CartItem existingItem = updatedItems.stream()
                    .filter(item -> item.getProductId().equals(product.getProductId()))
                    .findFirst()
                    .orElse(null);

            String updatedAt = Instant.now().toString();
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            } else {
                updatedItems.add(new CartItem(
                        cartItemSequence.getAndIncrement(),
                        cart.getCartId(),
                        product.getProductId(),
                        request.getQuantity(),
                        updatedAt
                ));
            }

            cart.setItems(updatedItems);
            cart.setUpdatedAt(updatedAt);
            return toResponse(cart);
        }
    }

    public CartResponse updateItem(String sessionId, Integer itemId, CartItemQuantityUpdateRequest request) {
        validateQuantity(request.getQuantity());

        Cart cart = getOrCreateCart(sessionId);
        synchronized (cart) {
            List<CartItem> updatedItems = new ArrayList<>(cart.getItems());
            CartItem item = findCartItemOrThrow(updatedItems, itemId);
            item.setQuantity(request.getQuantity());
            cart.setItems(updatedItems);
            cart.setUpdatedAt(Instant.now().toString());

            return toResponse(cart);
        }
    }

    public CartResponse removeItem(String sessionId, Integer itemId) {
        Cart cart = getOrCreateCart(sessionId);
        synchronized (cart) {
            List<CartItem> updatedItems = new ArrayList<>(cart.getItems());
            CartItem item = findCartItemOrThrow(updatedItems, itemId);
            updatedItems.remove(item);
            cart.setItems(updatedItems);
            cart.setUpdatedAt(Instant.now().toString());

            return toResponse(cart);
        }
    }

    public CartResponse clearCart(String sessionId) {
        Cart emptyCart = createCart(validateSessionId(sessionId));
        carts.put(emptyCart.getSessionId(), emptyCart);
        return toResponse(emptyCart);
    }

    private Cart getOrCreateCart(String sessionId) {
        String normalizedSessionId = validateSessionId(sessionId);
        return carts.computeIfAbsent(normalizedSessionId, this::createCart);
    }

    private Cart createCart(String sessionId) {
        String timestamp = Instant.now().toString();
        return new Cart(
                "cart-" + sessionId,
                sessionId,
                timestamp,
                timestamp,
                new ArrayList<>()
        );
    }

    private String validateSessionId(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new IllegalArgumentException("Session ID is required.");
        }

        return sessionId;
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1.");
        }
    }

    private Product findProductOrThrow(Integer productId) {
        return productService.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product with ID " + productId + " was not found."));
    }

    private CartItem findCartItemOrThrow(List<CartItem> items, Integer itemId) {
        return items.stream()
                .filter(item -> item.getCartItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Cart item with ID " + itemId + " was not found."));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        float subtotal = 0;
        float discountTotal = 0;
        int itemCount = 0;

        for (CartItem item : cart.getItems()) {
            Product product = findProductOrThrow(item.getProductId());
            float unitPrice = product.getPrice();
            float discount = product.getDiscount() != null ? product.getDiscount() : 0f;
            float lineSubtotal = unitPrice * item.getQuantity();
            float lineDiscount = unitPrice * discount * item.getQuantity();
            float lineTotal = lineSubtotal - lineDiscount;

            subtotal += lineSubtotal;
            discountTotal += lineDiscount;
            itemCount += item.getQuantity();

            items.add(new CartItemResponse(
                    item.getCartItemId(),
                    item.getProductId(),
                    product.getName(),
                    unitPrice,
                    item.getQuantity(),
                    product.getImgName(),
                    product.getDiscount(),
                    lineTotal
            ));
        }

        return new CartResponse(
                cart.getSessionId(),
                cart.getCartId(),
                cart.getCreatedAt(),
                cart.getUpdatedAt(),
                items,
                subtotal,
                discountTotal,
                subtotal - discountTotal,
                itemCount
        );
    }
}
