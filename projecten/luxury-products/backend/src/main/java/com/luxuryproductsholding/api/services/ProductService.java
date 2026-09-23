package com.luxuryproductsholding.api.services;

import com.luxuryproductsholding.api.models.Product;
import com.luxuryproductsholding.api.DAO.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByNameAsc();
    }

    public Optional<Product> getProductById(long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Optional<Product> createProduct(Product product) {
        try {
            return Optional.of(productRepository.save(product));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<Product> updateProduct(long id, Product product) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setStock(product.getStock());
                    existingProduct.setCategory(product.getCategory());
                    existingProduct.setImageUrl(product.getImageUrl());
                    return productRepository.save(existingProduct);
                });
    }

    @Transactional
    public Optional<Product> deleteProduct(long id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return product;
                });
    }
} 