package com.luxuryproductsholding.api.DAO;

import com.luxuryproductsholding.api.models.Category;
import com.luxuryproductsholding.api.models.GiftCard;
import com.luxuryproductsholding.api.models.Product;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class GiftCardDAO {

    private final GiftCardRepository giftCardRepository;
    private final ProductRepository productRepository;

    public GiftCardDAO(GiftCardRepository giftCardRepository, ProductRepository productRepository) {
        this.giftCardRepository = giftCardRepository;
        this.productRepository = productRepository;
    }

    public List<GiftCard> findAll() {
        return giftCardRepository.findAll();
    }

    // Create a gift card and a corresponding product
    public GiftCard createGiftCard(int value, Category category) {
        // Create gift card
        GiftCard card = new GiftCard();
        card.setValue(value);
        card.setCategory(category);
        card.setCode(UUID.randomUUID().toString());
        GiftCard savedCard = giftCardRepository.save(card);

        // Create product for the gift card
        String productName = "Cadeaubon €" + value;
        String productDescription = "Cadeaubon ter waarde van €" + value;
        String imageUrl = "https://cdn-icons-png.flaticon.com/512/679/679720.png";

        Product giftCardProduct = new Product(
            productName, 
            productDescription, 
            value, 
            imageUrl, 
            category,
            100  // Default stock value
        );

        productRepository.save(giftCardProduct);

        return savedCard;
    }

    // Handle partial redemption
    public boolean redeemGiftCard(Long id, int amount) {
        return giftCardRepository.findByIdAndBalanceGreaterThan(id, 0)
                .map(card -> {
                    int newBalance = card.getBalance() - amount;
                    if (newBalance < 0) {
                        return false; // Not enough balance
                    }
                    updateCardBalance(card, newBalance);
                    return true;
                })
                .orElse(false);
    }

    public boolean updateGiftCardBalance(String code, int newBalance) {
        return giftCardRepository.findByCode(code)
                .map(card -> {
                    updateCardBalance(card, newBalance);
                    return true;
                })
                .orElse(false);
    }

    private void updateCardBalance(GiftCard card, int newBalance) {
        card.setBalance(newBalance);
        card.setUsed(newBalance == 0);
        giftCardRepository.save(card);
    }

    public Optional<GiftCard> findByCodeAndAvailable(String code) {
        return giftCardRepository.findByCodeAndBalanceGreaterThan(code, 0);
    }

    public Optional<GiftCard> findByCode(String code) {
        return giftCardRepository.findByCode(code);
    }

    public Optional<GiftCard> findById(Long id) {
        return giftCardRepository.findById(id);
    }

    public GiftCard save(GiftCard giftCard) {
        return giftCardRepository.save(giftCard);
    }

    public void delete(GiftCard giftCard) {
        giftCardRepository.delete(giftCard);
    }

    public void deleteById(Long id) {
        giftCardRepository.deleteById(id);
    }
}
