package com.luxuryproductsholding.api.services;

import com.luxuryproductsholding.api.DAO.OrderItemRepository;
import com.luxuryproductsholding.api.DAO.OrderRepository;
import com.luxuryproductsholding.api.DAO.ProductRepository;
import com.luxuryproductsholding.api.DAO.UserRepository;
import com.luxuryproductsholding.api.DAO.GiftCardDAO;
import com.luxuryproductsholding.api.DTO.OrderItemDTO;
import com.luxuryproductsholding.api.DTO.OrderRequest;
import com.luxuryproductsholding.api.models.CustomUser;
import com.luxuryproductsholding.api.models.Order;
import com.luxuryproductsholding.api.models.OrderItem;
import com.luxuryproductsholding.api.models.Product;
import com.luxuryproductsholding.api.models.GiftCard;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class OrderService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final GiftCardDAO giftCardDAO;

    public OrderService(UserRepository userRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository, GiftCardDAO giftCardDAO) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.giftCardDAO = giftCardDAO;
    }

    @Transactional
    public ResponseEntity<Order> createOrder(OrderRequest orderRequest) {
        Optional<CustomUser> userOpt = userRepository.findById(orderRequest.getUserId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        CustomUser user = userOpt.get();
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(orderRequest.getShippingAddress());

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Bereken eerst de totale prijs van alle items
        // First check if all products have sufficient stock
        for (OrderItemDTO itemDTO : orderRequest.getOrderItems()) {
            Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            Product product = productOpt.get();
            if (product.getStock() < itemDTO.getQuantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // Product heeft niet genoeg voorraad
            }
        }

        // Then process the order and update stock
        for (OrderItemDTO itemDTO : orderRequest.getOrderItems()) {
            Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());
            Product product = productOpt.get();

            // Update stock
            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(itemDTO.getProductId());
            orderItem.setProductName(itemDTO.getProductName());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemDTO.getPrice());

            // Verwerk cadeaubonnen als het product een cadeaubon is
            if ((product.getCategory() != null && "Cadeaubonnen".equals(product.getCategory().getName())) 
                || (product.getName() != null && product.getName().toLowerCase().contains("cadeaubon"))
                || (product.getDescription() != null && product.getDescription().toLowerCase().contains("cadeaubon"))) {
                processGiftCardPurchase(itemDTO, orderItem, product);
            }

            orderItem.setOrder(order);
            orderItems.add(orderItem);

            totalPrice = totalPrice.add(BigDecimal.valueOf(itemDTO.getPrice())
                    .multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
        }

        // Pas cadeaubon korting toe als er een is
        if (orderRequest.getAppliedGiftCardCode() != null && !orderRequest.getAppliedGiftCardCode().trim().isEmpty()) {
            Optional<GiftCard> giftCard = giftCardDAO.findByCodeAndAvailable(
                    orderRequest.getAppliedGiftCardCode().trim());

            if (giftCard.isPresent()) {
                GiftCard usedCard = giftCard.get();
                BigDecimal giftCardBalance = BigDecimal.valueOf(usedCard.getBalance());

                // Store original prices for reference
                for (OrderItem item : orderItems) {
                    item.setOriginalPrice(item.getPrice());
                }

                System.out.println("Original total price: " + totalPrice);
                System.out.println("Gift card balance: " + giftCardBalance);

                // Calculate how much of the gift card balance to use
                BigDecimal amountToUse = totalPrice.min(giftCardBalance);

                // Apply gift card discount to total price
                totalPrice = totalPrice.subtract(amountToUse);

                // Ensure total price is not negative
                totalPrice = totalPrice.max(BigDecimal.ZERO);

                // Update gift card balance
                int newBalance = usedCard.getBalance() - amountToUse.intValue();
                usedCard.setBalance(newBalance);
                usedCard.setUsed(newBalance == 0);

                System.out.println("New total price after applying gift card discount: " + totalPrice);
                System.out.println("New gift card balance: " + newBalance);

                giftCardDAO.save(usedCard);

                // Gift card has been applied and marked as used
            }
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    // Helper methode voor cadeaubon aankopen
    private void processGiftCardPurchase(OrderItemDTO itemDTO, OrderItem orderItem, Product product) {
        for (int i = 0; i < itemDTO.getQuantity(); i++) {
            GiftCard newGiftCard = new GiftCard();
            newGiftCard.setValue((int) itemDTO.getPrice());
            newGiftCard.setCategory(product.getCategory());
            newGiftCard.setCode(UUID.randomUUID().toString());
            newGiftCard.setUsed(false);

            GiftCard savedGiftCard = giftCardDAO.save(newGiftCard);

            if (i == 0) {
                orderItem.setGiftCardCode(savedGiftCard.getCode());
            } else {
                String existingCodes = orderItem.getGiftCardCode();
                orderItem.setGiftCardCode(existingCodes + "," + savedGiftCard.getCode());
            }
        }
    }

    /**
     * Haalt alle bestellingen op van een specifieke gebruiker
     * Controleert of de ingelogde gebruiker toegang heeft tot deze bestellingen
     * @param id ID van de gebruiker
     * @return ResponseEntity met lijst van bestellingen of een foutmelding
     */
    public ResponseEntity<List<Order>> getOrdersByUserId(long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String authenticatedEmail = ((UserDetails) principal).getUsername();
        Optional<CustomUser> userOpt = userRepository.findByEmail(authenticatedEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUser authenticatedUser = userOpt.get();
        if (authenticatedUser.getId() != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<Order> orders = orderRepository.findByUserId(id);
        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(orders);
    }

    /**
     * Haalt alle bestellingen op uit het systeem
     * Alleen toegankelijk voor admins
     * @return Lijst van alle bestellingen
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Zoekt een specifieke bestelling op basis van ID
     * @param id ID van de bestelling
     * @return Optional met de bestelling indien gevonden
     */
    public Optional<Order> getOrderById(long id) {
        return orderRepository.findById(id);
    }

    // Order status functionality has been removed
    @Transactional
    public Optional<Order> updateOrderStatus(long id, String status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return Optional.empty();
        }

        Order order = orderOpt.get();
        // Status functionality has been removed, just return the order
        return Optional.of(orderRepository.save(order));
    }

    /**
     * Annuleert een bestelling
     * Herstelt de voorraad van de producten
     * @param id ID van de bestelling
     * @return Optional met de geannuleerde bestelling
     */
    @Transactional
    public Optional<Order> cancelOrder(long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    // Restore stock for each product in the order
                    for (OrderItem item : order.getOrderItems()) {
                        Optional<Product> productOpt = productRepository.findById(item.getProductId());
                        if (productOpt.isPresent()) {
                            Product product = productOpt.get();
                            product.setStock(product.getStock() + item.getQuantity());
                            productRepository.save(product);
                        }
                    }

                    return orderRepository.save(order);
                });
    }


}
