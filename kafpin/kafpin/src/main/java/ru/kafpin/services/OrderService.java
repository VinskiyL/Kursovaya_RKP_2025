package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.OrderCatalog;
import ru.kafpin.repositories.OrderCatalogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    private final OrderCatalogRepository orderRepository;

    @Autowired
    public OrderService(OrderCatalogRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderCatalog> getAllOrders() {
        return orderRepository.findAll();
    }

    public OrderCatalog getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
}