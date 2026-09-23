package com.luxuryproductsholding.api.DAO;

import com.luxuryproductsholding.api.models.GiftCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GiftCardRepository extends JpaRepository<GiftCard, Long> {
    Optional<GiftCard> findByIdAndBalanceGreaterThan(Long id, int balance);
    Optional<GiftCard> findByCodeAndBalanceGreaterThan(String code, int balance);
    Optional<GiftCard> findByCode(String code);
}
