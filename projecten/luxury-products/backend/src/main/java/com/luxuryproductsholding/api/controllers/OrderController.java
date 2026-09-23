package com.luxuryproductsholding.api.controllers;

import com.luxuryproductsholding.api.DTO.OrderRequest;
import com.luxuryproductsholding.api.models.Order;
import com.luxuryproductsholding.api.models.CustomUser;
import com.luxuryproductsholding.api.services.OrderService;
import com.luxuryproductsholding.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller voor het afhandelen van alle order-gerelateerde HTTP verzoeken
 * Bevat endpoints voor het maken en ophalen van bestellingen
 */
@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @Autowired
    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    /**
     * Maakt een nieuwe bestelling aan
     * @param orderRequest De bestelling gegevens inclusief items en afleveradres
     * @return ResponseEntity met de aangemaakte bestelling
     */
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    /**
     * Haalt alle bestellingen op van een specifieke gebruiker
     * Controleert of de ingelogde gebruiker toegang heeft tot deze bestellingen
     * @param id ID van de gebruiker
     * @return ResponseEntity met lijst van bestellingen
     */
    @GetMapping("/{id}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable long id) {
        return orderService.getOrdersByUserId(id);
    }

    // Order status functionality has been removed
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable long orderId,
            @RequestBody String status) {

        CustomUser authenticatedUser = userService.getAuthenticatedUser();
        if (authenticatedUser == null) {
            return ResponseEntity.status(401).body(null);
        }

        if (!userService.isAdmin(authenticatedUser)) {
            return ResponseEntity.status(403).body(null);
        }

        return orderService.updateOrderStatus(orderId, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
