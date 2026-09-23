package com.luxuryproductsholding.api.DAO;

import com.luxuryproductsholding.api.models.Category;
import com.luxuryproductsholding.api.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
