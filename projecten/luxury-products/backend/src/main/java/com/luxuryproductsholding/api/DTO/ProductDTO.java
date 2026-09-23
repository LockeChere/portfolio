package com.luxuryproductsholding.api.DTO;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.luxuryproductsholding.api.models.Category;

public class ProductDTO {

    public String name;
    public String description;
    public double price;
    public String imageUrl;
    public Category category;
    public int stockQuantity;

    public ProductDTO(String name, String description, double price, String imageUrl, Category category, int stockQuantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stockQuantity = stockQuantity;
    }

}
