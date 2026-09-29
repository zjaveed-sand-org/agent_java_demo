package com.github.av2.api.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String sessionId;
    private String cartId;
    private String createdAt;
    private String updatedAt;
    private List<CartItemResponse> items;
    private Float subtotal;
    private Float discountTotal;
    private Float total;
    private Integer itemCount;
}
