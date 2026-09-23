package com.luxuryproductsholding.api.DAO;

import com.luxuryproductsholding.api.models.Category;
import com.luxuryproductsholding.api.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByNameAsc();
}
