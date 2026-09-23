package com.luxuryproductsholding.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.luxuryproductsholding.api.DAO.*;
import com.luxuryproductsholding.api.DTO.OrderItemDTO;
import com.luxuryproductsholding.api.DTO.OrderRequest;
import com.luxuryproductsholding.api.models.*;
import com.luxuryproductsholding.api.services.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mockito.ArgumentCaptor;

public class OrderServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private GiftCardDAO giftCardDAO;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateOrderWithGiftCard() {
        // Setup test data
        Long userId = 1L;
        CustomUser user = new CustomUser();
        user.setId(userId);

        // Create product
        Long productId = 1L;
        Product product = new Product();
        product.setId(productId);
        product.setName("Test Product");
        product.setPrice(100.0);
        product.setStock(10);

        // Create gift card
        String giftCardCode = "TEST123";
        GiftCard giftCard = new GiftCard();
        giftCard.setCode(giftCardCode);
        giftCard.setValue(20); // $20 gift card
        giftCard.setUsed(false);

        // Create order request
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setUserId(userId);
        orderRequest.setShippingAddress("123 Test St");
        orderRequest.setAppliedGiftCardCode(giftCardCode);

        // Create order item
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setProductId(productId);
        orderItemDTO.setProductName("Test Product");
        orderItemDTO.setQuantity(1);
        orderItemDTO.setPrice(100.0);

        List<OrderItemDTO> orderItems = new ArrayList<>();
        orderItems.add(orderItemDTO);
        orderRequest.setOrderItems(orderItems);

        // Mock repository responses
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(giftCardDAO.findByCodeAndAvailable(giftCardCode)).thenReturn(Optional.of(giftCard));

        // Mock save operations
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order savedOrder = invocation.getArgument(0);
            savedOrder.setId(1L);
            return savedOrder;
        });

        when(orderItemRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute the method
        ResponseEntity<Order> response = orderService.createOrder(orderRequest);

        // Verify the response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        // Verify the order price is correctly discounted
        Order savedOrder = response.getBody();
        assertEquals(80.0, savedOrder.getTotalPrice().doubleValue(), 0.001); // 100 - 20 = 80

        // Verify the gift card is marked as used
        verify(giftCardDAO).save(argThat(gc -> gc.isUsed()));

        // Verify the order is saved only once
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    public void testCreateOrderWithPartiallyUsedGiftCard() {
        // Setup test data
        Long userId = 1L;
        CustomUser user = new CustomUser();
        user.setId(userId);

        // Create product
        Long productId = 1L;
        Product product = new Product();
        product.setId(productId);
        product.setName("Test Product");
        product.setPrice(50.0);
        product.setStock(10);

        // Create gift card with a remaining balance (partially used)
        String giftCardCode = "PARTIAL123";
        GiftCard giftCard = new GiftCard();
        giftCard.setCode(giftCardCode);
        giftCard.setValue(100); // Original value $100
        giftCard.setBalance(60); // Remaining balance $60
        giftCard.setUsed(false); // Not fully used yet

        // Create order request
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setUserId(userId);
        orderRequest.setShippingAddress("123 Test St");
        orderRequest.setAppliedGiftCardCode(giftCardCode);

        // Create order item
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setProductId(productId);
        orderItemDTO.setProductName("Test Product");
        orderItemDTO.setQuantity(1);
        orderItemDTO.setPrice(50.0);

        List<OrderItemDTO> orderItems = new ArrayList<>();
        orderItems.add(orderItemDTO);
        orderRequest.setOrderItems(orderItems);

        // Mock repository responses
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(giftCardDAO.findByCodeAndAvailable(giftCardCode)).thenReturn(Optional.of(giftCard));

        // Capture the gift card that's saved
        ArgumentCaptor<GiftCard> giftCardCaptor = ArgumentCaptor.forClass(GiftCard.class);

        // Mock save operations
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order savedOrder = invocation.getArgument(0);
            savedOrder.setId(1L);
            return savedOrder;
        });

        when(orderItemRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute the method
        ResponseEntity<Order> response = orderService.createOrder(orderRequest);

        // Verify the response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        // Verify the order price is correctly discounted
        Order savedOrder = response.getBody();
        assertEquals(0.0, savedOrder.getTotalPrice().doubleValue(), 0.001); // 50 - 50 = 0

        // Verify the gift card is saved with updated balance
        verify(giftCardDAO).save(giftCardCaptor.capture());
        GiftCard savedGiftCard = giftCardCaptor.getValue();

        // Verify the gift card balance is updated correctly
        assertEquals(10, savedGiftCard.getBalance()); // 60 - 50 = 10
        assertFalse(savedGiftCard.isUsed()); // Should still be false since balance > 0

        // Verify the order is saved only once
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}
