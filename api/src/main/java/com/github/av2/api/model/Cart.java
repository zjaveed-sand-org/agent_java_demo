package com.github.av2.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Shopping cart information")
public class Cart {
    @Schema(description = "The unique identifier for the cart", required = true)
    private String cartId;

    @Schema(description = "The session identifier that owns the cart", required = true)
    private String sessionId;

    @Schema(description = "The timestamp when the cart was created", required = true)
    private String createdAt;

    @Schema(description = "The timestamp when the cart was last updated", required = true)
    private String updatedAt;

    @Schema(description = "The items in the cart")
    private List<CartItem> items;

    public List<CartItem> getItems() {
        if (items == null) {
            return List.of();
        }

        return Collections.unmodifiableList(new ArrayList<>(items));
    }

    public void setItems(List<CartItem> items) {
        if (items == null) {
            this.items = null;
            return;
        }

        this.items = new ArrayList<>(items);
    }
}
