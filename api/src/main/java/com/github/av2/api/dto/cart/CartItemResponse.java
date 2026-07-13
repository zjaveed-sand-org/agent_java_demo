package com.github.av2.api.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Integer cartItemId;
    private Integer productId;
    private String name;
    private Float price;
    private Integer quantity;
    private String imgName;
    private Float discount;
    private Float lineTotal;
}
