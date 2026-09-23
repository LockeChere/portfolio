package com.luxuryproductsholding.api.controllers;

import com.luxuryproductsholding.api.DAO.CategoryRepository;
import com.luxuryproductsholding.api.DAO.GiftCardDAO;
import com.luxuryproductsholding.api.DAO.ProductRepository;
import com.luxuryproductsholding.api.models.Category;
import com.luxuryproductsholding.api.models.GiftCard;
import com.luxuryproductsholding.api.models.Product;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;


@RestController
@RequestMapping("/admin")
public class AdminController {

    private final GiftCardDAO giftCardDAO;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public AdminController(GiftCardDAO giftCardDAO, CategoryRepository categoryRepository, 
                         ProductRepository productRepository) {
        this.giftCardDAO = giftCardDAO;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to the Admin Dashboard!");
    }


    // Purchased Gift Card Management Endpoints
    @GetMapping("/purchased-giftcards")
    public ResponseEntity<List<GiftCard>> getAllPurchasedGiftCards() {
        return ResponseEntity.ok(giftCardDAO.findAll());
    }

    @GetMapping("/purchased-giftcards/{id}")
    public ResponseEntity<GiftCard> getPurchasedGiftCardById(@PathVariable Long id) {
        Optional<GiftCard> giftCardOpt = giftCardDAO.findById(id);
        return giftCardOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/purchased-giftcards/{id}")
    public ResponseEntity<GiftCard> updatePurchasedGiftCard(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<GiftCard> giftCardOpt = giftCardDAO.findById(id);
            if (giftCardOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GiftCard giftCard = giftCardOpt.get();

            if (payload.containsKey("value")) {
                Integer value = (Integer) payload.get("value");
                if (value != null && value > 0) {
                    giftCard.setValue(value);
                }
            }

            if (payload.containsKey("used")) {
                Boolean used = (Boolean) payload.get("used");
                if (used != null) {
                    giftCard.setUsed(used);
                }
            }

            if (payload.containsKey("categoryId")) {
                Integer categoryId = (Integer) payload.get("categoryId");
                if (categoryId != null) {
                    Optional<Category> categoryOpt = categoryRepository.findById(categoryId.longValue());
                    if (categoryOpt.isPresent()) {
                        giftCard.setCategory(categoryOpt.get());
                    }
                } else {
                    giftCard.setCategory(null);
                }
            }

            GiftCard updatedGiftCard = giftCardDAO.save(giftCard);
            return ResponseEntity.ok(updatedGiftCard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/purchased-giftcards/{id}")
    public ResponseEntity<Void> deletePurchasedGiftCard(@PathVariable Long id) {
        try {
            Optional<GiftCard> giftCardOpt = giftCardDAO.findById(id);
            if (giftCardOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Set the balance to zero before deleting the gift card
            GiftCard giftCard = giftCardOpt.get();
            giftCard.setBalance(0);
            giftCard.setUsed(true);
            giftCardDAO.save(giftCard);

            giftCardDAO.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // For backward compatibility
    @GetMapping("/giftcards")
    public ResponseEntity<List<GiftCard>> getAllGiftCardsLegacy() {
        return getAllPurchasedGiftCards();
    }


    @GetMapping("/giftcards/{id}")
    public ResponseEntity<GiftCard> getGiftCardByIdLegacy(@PathVariable Long id) {
        return getPurchasedGiftCardById(id);
    }

    @PutMapping("/giftcards/{id}")
    public ResponseEntity<GiftCard> updateGiftCardLegacy(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return updatePurchasedGiftCard(id, payload);
    }

    @DeleteMapping("/giftcards/{id}")
    public ResponseEntity<Void> deleteGiftCardLegacy(@PathVariable Long id) {
        return deletePurchasedGiftCard(id);
    }

    // Gift Card Product Management Endpoints
    @GetMapping("/giftcard-products")
    public ResponseEntity<List<Product>> getAllGiftCardProducts() {
        try {
            // Find products that are gift cards (name starts with "Cadeaubon")
            List<Product> giftCardProducts = productRepository.findAll().stream()
                    .filter(product -> product.getName().startsWith("Cadeaubon"))
                    .toList();
            return ResponseEntity.ok(giftCardProducts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/giftcard-products")
    public ResponseEntity<Product> createGiftCardProduct(@RequestBody Map<String, Object> payload) {
        try {
            // Extract values from payload
            Double value = Double.parseDouble(payload.get("value").toString());
            Integer categoryId = payload.get("categoryId") != null ? (Integer) payload.get("categoryId") : null;
            String imageUrl = payload.containsKey("imageUrl") ? (String) payload.get("imageUrl") : "https://cdn-icons-png.flaticon.com/512/679/679720.png";
            Integer stock = payload.containsKey("stock") ? Integer.parseInt(payload.get("stock").toString()) : 100;

            if (value == null || value <= 0) {
                return ResponseEntity.badRequest().build();
            }

            // Find category if provided
            Category category = null;
            if (categoryId != null) {
                Optional<Category> categoryOpt = categoryRepository.findById(categoryId.longValue());
                if (categoryOpt.isPresent()) {
                    category = categoryOpt.get();
                } else {
                    return ResponseEntity.badRequest().build();
                }
            }

            // Create product for the gift card
            String productName = "Cadeaubon €" + value;
            String productDescription = "Cadeaubon ter waarde van €" + value;

            Product giftCardProduct = new Product(
                productName, 
                productDescription, 
                value, 
                imageUrl, 
                category,
                stock
            );

            Product savedProduct = productRepository.save(giftCardProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/giftcard-products/{id}")
    public ResponseEntity<Product> getGiftCardProductById(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            if (productOpt.isEmpty() || !productOpt.get().getName().startsWith("Cadeaubon")) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(productOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/giftcard-products/{id}")
    public ResponseEntity<Product> updateGiftCardProduct(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            if (productOpt.isEmpty() || !productOpt.get().getName().startsWith("Cadeaubon")) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOpt.get();

            if (payload.containsKey("name")) {
                String name = (String) payload.get("name");
                if (name != null && !name.isEmpty()) {
                    product.setName(name);
                }
            }

            if (payload.containsKey("description")) {
                String description = (String) payload.get("description");
                if (description != null) {
                    product.setDescription(description);
                }
            }

            if (payload.containsKey("price")) {
                Double price = Double.parseDouble(payload.get("price").toString());
                if (price != null && price > 0) {
                    product.setPrice(price);
                }
            }

            if (payload.containsKey("imageUrl")) {
                String imageUrl = (String) payload.get("imageUrl");
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    product.setImageUrl(imageUrl);
                }
            }

            if (payload.containsKey("stock")) {
                Integer stock = Integer.parseInt(payload.get("stock").toString());
                if (stock != null && stock >= 0) {
                    product.setStock(stock);
                }
            }

            if (payload.containsKey("categoryId")) {
                Integer categoryId = (Integer) payload.get("categoryId");
                if (categoryId != null) {
                    Optional<Category> categoryOpt = categoryRepository.findById(categoryId.longValue());
                    if (categoryOpt.isPresent()) {
                        product.setCategory(categoryOpt.get());
                    }
                } else {
                    product.setCategory(null);
                }
            }

            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/giftcard-products/{id}")
    public ResponseEntity<Void> deleteGiftCardProduct(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            if (productOpt.isEmpty() || !productOpt.get().getName().startsWith("Cadeaubon")) {
                return ResponseEntity.notFound().build();
            }

            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
