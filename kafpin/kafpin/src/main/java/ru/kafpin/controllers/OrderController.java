package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.OrderCatalog;
import ru.kafpin.services.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderCatalog> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderCatalog getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
}