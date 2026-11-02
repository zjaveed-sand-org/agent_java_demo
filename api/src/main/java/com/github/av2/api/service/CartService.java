package com.github.av2.api.service;

import com.github.av2.api.dto.cart.CartItemQuantityUpdateRequest;
import com.github.av2.api.dto.cart.CartItemRequest;
import com.github.av2.api.dto.cart.CartItemResponse;
import com.github.av2.api.dto.cart.CartResponse;
import com.github.av2.api.model.Cart;
import com.github.av2.api.model.CartItem;
import com.github.av2.api.model.Product;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Service
public class CartService {
    private static final Duration CART_TTL = Duration.ofHours(24);
    private static final int MAX_SESSION_ID_LENGTH = 128;
    private static final Pattern SESSION_ID_PATTERN = Pattern.compile("[A-Za-z0-9._:-]+");
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
        Cart cart = getOrCreateCart(sessionId);
        synchronized (cart) {
            cart.setItems(List.of());
            cart.setUpdatedAt(Instant.now().toString());
            return toResponse(cart);
        }
    }

    private Cart getOrCreateCart(String sessionId) {
        String normalizedSessionId = validateSessionId(sessionId);
        pruneExpiredCarts();
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
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID is required.");
        }

        String normalizedSessionId = sessionId.trim();
        if (normalizedSessionId.isEmpty()) {
            throw new IllegalArgumentException("Session ID is required.");
        }
        if (normalizedSessionId.length() > MAX_SESSION_ID_LENGTH) {
            throw new IllegalArgumentException("Session ID must be 128 characters or fewer.");
        }
        if (!SESSION_ID_PATTERN.matcher(normalizedSessionId).matches()) {
            throw new IllegalArgumentException("Session ID contains invalid characters.");
        }

        return normalizedSessionId;
    }

    private void pruneExpiredCarts() {
        Instant cutoff = Instant.now().minus(CART_TTL);
        carts.entrySet().removeIf(entry -> isExpired(entry.getValue(), cutoff));
    }

    private boolean isExpired(Cart cart, Instant cutoff) {
        synchronized (cart) {
            try {
                return Instant.parse(cart.getUpdatedAt()).isBefore(cutoff);
            } catch (DateTimeParseException exception) {
                return false;
            }
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1.");
        }
    }

    private Product findProductOrThrow(Integer productId) {
        return findProduct(productId)
                .orElseThrow(() -> new NoSuchElementException("Product with ID " + productId + " was not found."));
    }

    private Optional<Product> findProduct(Integer productId) {
        return productService.findById(productId);
    }

    private CartItem findCartItemOrThrow(List<CartItem> items, Integer itemId) {
        return items.stream()
                .filter(item -> item.getCartItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Cart item with ID " + itemId + " was not found."));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = new ArrayList<>();
        List<CartItem> validItems = new ArrayList<>();
        float subtotal = 0;
        float discountTotal = 0;
        int itemCount = 0;

        for (CartItem item : cart.getItems()) {
            Optional<Product> maybeProduct = findProduct(item.getProductId());
            if (maybeProduct.isEmpty()) {
                continue;
            }

            Product product = maybeProduct.get();
            float unitPrice = product.getPrice();
            float discount = product.getDiscount() != null ? product.getDiscount() : 0f;
            float lineSubtotal = unitPrice * item.getQuantity();
            float lineDiscount = unitPrice * discount * item.getQuantity();
            float lineTotal = lineSubtotal - lineDiscount;

            validItems.add(item);
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

        if (validItems.size() != cart.getItems().size()) {
            cart.setItems(validItems);
            cart.setUpdatedAt(Instant.now().toString());
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
