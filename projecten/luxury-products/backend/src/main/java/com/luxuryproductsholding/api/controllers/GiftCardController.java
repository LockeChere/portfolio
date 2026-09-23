package com.luxuryproductsholding.api.controllers;

import com.luxuryproductsholding.api.DAO.*;
import com.luxuryproductsholding.api.models.GiftCard;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/giftcards")
public class GiftCardController {

    private final GiftCardDAO giftCardDAO;

    public GiftCardController(GiftCardDAO giftCardDAO) {
        this.giftCardDAO = giftCardDAO;
    }

    @GetMapping
    public ResponseEntity<List<GiftCard>> getAllGiftCards() {
        return ResponseEntity.ok(giftCardDAO.findAll());
    }

    @PostMapping("/redeem")
    public ResponseEntity<GiftCard> redeemByCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return giftCardDAO.findByCodeAndAvailable(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/balance")
    public ResponseEntity<GiftCard> updateBalance(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Integer newBalance = (Integer) payload.get("balance");

        if (code == null || code.trim().isEmpty() || newBalance == null || newBalance < 0) {
            return ResponseEntity.badRequest().build();
        }

        boolean updated = giftCardDAO.updateGiftCardBalance(code, newBalance);
        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        Optional<GiftCard> giftCard = giftCardDAO.findByCode(code);
        if (giftCard.isPresent()) {
            return ResponseEntity.ok(giftCard.get());
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<GiftCard> getGiftCardByCode(@PathVariable String code) {
        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return giftCardDAO.findByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
