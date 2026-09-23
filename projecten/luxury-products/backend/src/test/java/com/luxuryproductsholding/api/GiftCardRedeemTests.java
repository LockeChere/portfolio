package com.luxuryproductsholding.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.*;

import java.util.*;

import com.luxuryproductsholding.api.DAO.*;
import com.luxuryproductsholding.api.controllers.GiftCardController;
import com.luxuryproductsholding.api.models.GiftCard;
import com.luxuryproductsholding.api.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

public class GiftCardRedeemTests {

    @Mock
    private GiftCardDAO giftCardDAO;

    @InjectMocks
    private GiftCardController giftCardController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRedeemByCode_Success() {
        // Arrange
        String code = "ABC123";

        GiftCard giftCard = new GiftCard();
        giftCard.setCode(code);
        giftCard.setValue(50); // This will also set the balance to 50
        giftCard.setUsed(false);

        when(giftCardDAO.findByCodeAndAvailable(code)).thenReturn(Optional.of(giftCard));

        Map<String, String> payload = new HashMap<>();
        payload.put("code", code);

        // Act
        ResponseEntity<GiftCard> response = giftCardController.redeemByCode(payload);

        // Assert
        assertEquals(OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(code, response.getBody().getCode());
        assertEquals(50, response.getBody().getBalance());
        assertFalse(response.getBody().isUsed());

        verify(giftCardDAO).findByCodeAndAvailable(code);
    }

    @Test
    public void testRedeemByCode_CodeMissingOrEmpty() {
        // Arrange
        Map<String, String> payload = new HashMap<>();

        // Act & Assert - Test with missing code
        ResponseEntity<GiftCard> response = giftCardController.redeemByCode(payload);
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Act & Assert - Test with empty code
        payload.put("code", "   ");
        response = giftCardController.redeemByCode(payload);
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Verify that findByCodeAndAvailable was never called
        verify(giftCardDAO, never()).findByCodeAndAvailable(anyString());
    }

    @Test
    public void testRedeemByCode_CodeNotFound() {
        // Arrange
        String code = "NOTEXIST";

        when(giftCardDAO.findByCodeAndAvailable(code)).thenReturn(Optional.empty());

        Map<String, String> payload = new HashMap<>();
        payload.put("code", code);

        // Act
        ResponseEntity<GiftCard> response = giftCardController.redeemByCode(payload);

        // Assert
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(giftCardDAO).findByCodeAndAvailable(code);
    }

    @Test
    public void testRedeemByCode_GiftCardWithZeroBalance() {
        // Arrange
        String code = "ZEROBALANCE";

        when(giftCardDAO.findByCodeAndAvailable(code)).thenReturn(Optional.empty());

        Map<String, String> payload = new HashMap<>();
        payload.put("code", code);

        // Act
        ResponseEntity<GiftCard> response = giftCardController.redeemByCode(payload);

        // Assert
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(giftCardDAO).findByCodeAndAvailable(code);
    }
    @Test
    public void testUpdateBalance_Success() {
        // Arrange
        String code = "ABC123";
        int newBalance = 25;

        GiftCard giftCard = new GiftCard();
        giftCard.setCode(code);
        giftCard.setValue(50);
        giftCard.setBalance(50);

        when(giftCardDAO.updateGiftCardBalance(code, newBalance)).thenReturn(true);
        when(giftCardDAO.findByCode(code)).thenReturn(Optional.of(giftCard));

        Map<String, Object> payload = new HashMap<>();
        payload.put("code", code);
        payload.put("balance", newBalance);

        // Act
        ResponseEntity<GiftCard> response = giftCardController.updateBalance(payload);

        // Assert
        assertEquals(OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(code, response.getBody().getCode());
        assertEquals(50, response.getBody().getValue());

        verify(giftCardDAO).updateGiftCardBalance(code, newBalance);
        verify(giftCardDAO).findByCode(code);
    }

    @Test
    public void testUpdateBalance_GiftCardNotFound() {
        // Arrange
        String code = "NOTEXIST";
        int newBalance = 25;

        when(giftCardDAO.updateGiftCardBalance(code, newBalance)).thenReturn(false);

        Map<String, Object> payload = new HashMap<>();
        payload.put("code", code);
        payload.put("balance", newBalance);

        // Act
        ResponseEntity<GiftCard> response = giftCardController.updateBalance(payload);

        // Assert
        assertEquals(NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        verify(giftCardDAO).updateGiftCardBalance(code, newBalance);
        verify(giftCardDAO, never()).findByCode(code);
    }

    @Test
    public void testUpdateBalance_InvalidInput() {
        // Arrange
        Map<String, Object> payload = new HashMap<>();

        // Act & Assert - Test with missing code
        ResponseEntity<GiftCard> response = giftCardController.updateBalance(payload);
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Act & Assert - Test with empty code
        payload.put("code", "   ");
        payload.put("balance", 25);
        response = giftCardController.updateBalance(payload);
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Act & Assert - Test with negative balance
        payload.put("code", "ABC123");
        payload.put("balance", -10);
        response = giftCardController.updateBalance(payload);
        assertEquals(BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        // Verify that updateGiftCardBalance was never called
        verify(giftCardDAO, never()).updateGiftCardBalance(anyString(), anyInt());
    }
}
