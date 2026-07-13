package com.github.av2.api.service;

import com.github.av2.api.dto.cart.CartItemQuantityUpdateRequest;
import com.github.av2.api.dto.cart.CartItemRequest;
import com.github.av2.api.dto.cart.CartResponse;
import com.github.av2.api.model.Cart;
import com.github.av2.api.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

class CartServiceTest {
    @Mock
    private ProductService productService;

    private CartService cartService;

    private Product feederProduct;
    private Product cameraProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        feederProduct = new Product(1, 3, "SmartFeeder One", "Feeder", 129.99f, "SKU-1", "piece", "feeder.png", 0.25f);
        cameraProduct = new Product(2, 3, "ChirpCam Window Mount", "Camera", 99.99f, "SKU-2", "piece", "camera.png", null);

        when(productService.findById(1)).thenReturn(Optional.of(feederProduct));
        when(productService.findById(2)).thenReturn(Optional.of(cameraProduct));
        when(productService.findById(999)).thenReturn(Optional.empty());

        cartService = new CartService(productService);
    }

    @Test
    void getCart_ShouldReturnEmptyCartForNewSession() {
        CartResponse response = cartService.getCart("session-a");

        assertEquals("session-a", response.getSessionId());
        assertTrue(response.getItems().isEmpty());
        assertEquals(0, response.getItemCount());
        assertEquals(0f, response.getTotal());
    }

    @Test
    void addItem_ShouldMergeQuantitiesForSameProduct() {
        cartService.addItem("session-a", new CartItemRequest(1, 1));
        CartResponse response = cartService.addItem("session-a", new CartItemRequest(1, 2));

        assertEquals(1, response.getItems().size());
        assertEquals(3, response.getItems().get(0).getQuantity());
        assertEquals(3, response.getItemCount());
        assertEquals(389.97f, response.getSubtotal(), 0.001f);
        assertEquals(97.4925f, response.getDiscountTotal(), 0.001f);
        assertEquals(292.4775f, response.getTotal(), 0.001f);
    }

    @Test
    void addItem_ShouldThrowWhenProductDoesNotExist() {
        assertThrows(
                java.util.NoSuchElementException.class,
                () -> cartService.addItem("session-a", new CartItemRequest(999, 1))
        );
    }

    @Test
    void updateItem_ShouldReplaceQuantity() {
        CartResponse created = cartService.addItem("session-a", new CartItemRequest(2, 1));

        CartResponse updated = cartService.updateItem(
                "session-a",
                created.getItems().get(0).getCartItemId(),
                new CartItemQuantityUpdateRequest(4)
        );

        assertEquals(4, updated.getItems().get(0).getQuantity());
        assertEquals(4, updated.getItemCount());
        assertEquals(399.96f, updated.getTotal());
    }

    @Test
    void removeItem_ShouldDeleteItemFromCart() {
        CartResponse created = cartService.addItem("session-a", new CartItemRequest(2, 1));

        CartResponse updated = cartService.removeItem("session-a", created.getItems().get(0).getCartItemId());

        assertTrue(updated.getItems().isEmpty());
        assertEquals(0, updated.getItemCount());
        assertEquals(0f, updated.getTotal());
    }

    @Test
    void clearCart_ShouldRemoveAllItems() {
        cartService.addItem("session-a", new CartItemRequest(1, 1));
        cartService.addItem("session-a", new CartItemRequest(2, 1));

        CartResponse cleared = cartService.clearCart("session-a");

        assertTrue(cleared.getItems().isEmpty());
        assertEquals(0, cleared.getItemCount());
        assertEquals(0f, cleared.getSubtotal());
    }

    @Test
    void getCart_ShouldPruneExpiredSessions() throws ReflectiveOperationException {
        Field cartsField = CartService.class.getDeclaredField("carts");
        cartsField.setAccessible(true);

        @SuppressWarnings("unchecked")
        Map<String, Cart> carts = (Map<String, Cart>) cartsField.get(cartService);
        carts.put(
                "expired-session",
                new Cart(
                        "cart-expired-session",
                        "expired-session",
                        Instant.now().minusSeconds(60L * 60 * 48).toString(),
                        Instant.now().minusSeconds(60L * 60 * 48).toString(),
                        java.util.List.of()
                )
        );

        cartService.getCart("active-session");

        assertTrue(carts.containsKey("active-session"));
        assertTrue(!carts.containsKey("expired-session"));
    }
}
