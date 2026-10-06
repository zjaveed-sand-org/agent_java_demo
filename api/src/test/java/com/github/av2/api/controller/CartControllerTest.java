package com.github.av2.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.av2.api.dto.cart.CartItemQuantityUpdateRequest;
import com.github.av2.api.dto.cart.CartItemRequest;
import com.github.av2.api.dto.cart.CartItemResponse;
import com.github.av2.api.dto.cart.CartResponse;
import com.github.av2.api.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CartController.class)
class CartControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    @Autowired
    private ObjectMapper objectMapper;

    private CartResponse cartResponse;

    @BeforeEach
    void setUp() {
        cartResponse = new CartResponse(
                "session-a",
                "cart-session-a",
                "2026-07-05T00:00:00Z",
                "2026-07-05T00:00:00Z",
                List.of(new CartItemResponse(1, 1, "SmartFeeder One", 129.99f, 2, "feeder.png", 0.25f, 194.985f)),
                259.98f,
                64.995f,
                194.985f,
                2
        );
    }

    @Test
    void getCart_ShouldReturnCartContents() throws Exception {
        when(cartService.getCart("session-a")).thenReturn(cartResponse);

        mockMvc.perform(get("/api/cart/session-a"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").value("session-a"))
                .andExpect(jsonPath("$.items[0].name").value("SmartFeeder One"))
                .andExpect(jsonPath("$.itemCount").value(2));
    }

    @Test
    void addItem_ShouldReturnCreatedCart() throws Exception {
        when(cartService.addItem("session-a", new CartItemRequest(1, 2))).thenReturn(cartResponse);

        mockMvc.perform(post("/api/cart/session-a/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CartItemRequest(1, 2))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.cartId").value("cart-session-a"))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void updateItem_ShouldReturnUpdatedCart() throws Exception {
        when(cartService.updateItem("session-a", 1, new CartItemQuantityUpdateRequest(2))).thenReturn(cartResponse);

        mockMvc.perform(put("/api/cart/session-a/items/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CartItemQuantityUpdateRequest(2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(194.985));
    }

    @Test
    void removeItem_ShouldReturnUpdatedCart() throws Exception {
        when(cartService.removeItem("session-a", 1)).thenReturn(new CartResponse(
                "session-a",
                "cart-session-a",
                "2026-07-05T00:00:00Z",
                "2026-07-05T00:10:00Z",
                List.of(),
                0f,
                0f,
                0f,
                0
        ));

        mockMvc.perform(delete("/api/cart/session-a/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty())
                .andExpect(jsonPath("$.itemCount").value(0));
    }

    @Test
    void clearCart_ShouldReturnEmptyCart() throws Exception {
        when(cartService.clearCart("session-a")).thenReturn(new CartResponse(
                "session-a",
                "cart-session-a",
                "2026-07-05T00:00:00Z",
                "2026-07-05T00:10:00Z",
                List.of(),
                0f,
                0f,
                0f,
                0
        ));

        mockMvc.perform(delete("/api/cart/session-a"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(0))
                .andExpect(jsonPath("$.items").isEmpty());
    }

    @Test
    void updateItem_ShouldReturn404WhenItemDoesNotExist() throws Exception {
        when(cartService.updateItem("session-a", 999, new CartItemQuantityUpdateRequest(2)))
                .thenThrow(new NoSuchElementException("Cart item with ID 999 was not found."));

        mockMvc.perform(put("/api/cart/session-a/items/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CartItemQuantityUpdateRequest(2))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Cart item with ID 999 was not found."));
    }
}
