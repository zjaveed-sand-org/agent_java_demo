package com.github.av2.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Shopping cart item")
public class CartItem {
    @Schema(description = "The unique identifier for the cart item", required = true)
    private Integer cartItemId;

    @Schema(description = "The unique identifier for the cart", required = true)
    private String cartId;

    @Schema(description = "The unique identifier for the product", required = true)
    private Integer productId;

    @Schema(description = "The quantity in the cart", required = true)
    private Integer quantity;

    @Schema(description = "The timestamp when the item was added", required = true)
    private String addedAt;
}
