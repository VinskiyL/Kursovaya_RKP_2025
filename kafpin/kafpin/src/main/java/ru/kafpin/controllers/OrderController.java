package ru.kafpin.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.dtos.OrderCreateDTO;
import ru.kafpin.dtos.OrderResponseDTO;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.services.OrderService;
import ru.kafpin.services.ReaderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final ReaderService readerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponseDTO createOrder(
            @Valid @RequestBody OrderCreateDTO createDTO,
            Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);
        return orderService.createOrder(createDTO, reader.getId());
    }

    @GetMapping("/my")
    public List<OrderResponseDTO> getMyOrders(Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);
        return orderService.getMyOrders(reader.getId());
    }

    @PatchMapping("/{id}/confirm")
    public OrderResponseDTO confirmOrder(@PathVariable Long id) {
        return orderService.confirmOrder(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);
        orderService.deleteOrder(id, reader.getId());
    }

    @PutMapping("/{id}")
    public OrderResponseDTO updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderCreateDTO updateDTO,
            Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);
        return orderService.updateOrder(id, updateDTO, reader.getId());
    }
}