package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.OrderCreateDTO;
import ru.kafpin.dtos.OrderResponseDTO;
import ru.kafpin.pojos.OrderCatalog;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.OrderCatalogRepository;
import ru.kafpin.repositories.ReadersCatalogRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderCatalogRepository orderRepository;
    private final ReadersCatalogRepository readersRepository;

    private void checkOrderLimit(Long readerId) {
        long activeOrders = orderRepository.countByReaderIdAndConfirmedFalse(readerId);
        if (activeOrders >= 5) {
            throw new IllegalStateException("Нельзя создать более 5 заказов");
        }
    }

    @Transactional
    public OrderResponseDTO createOrder(OrderCreateDTO dto, Long readerId) {
        checkOrderLimit(readerId);

        ReadersCatalog reader = readersRepository.findById(readerId)
                .orElseThrow(() -> new IllegalArgumentException("Читатель не найден"));

        OrderCatalog order = new OrderCatalog();
        order.setTitle(dto.getTitle());
        order.setAuthorSurname(dto.getAuthorSurname());
        order.setAuthorName(dto.getAuthorName());
        order.setAuthorPatronymic(dto.getAuthorPatronymic());
        order.setQuantyti(dto.getQuantity());
        order.setDatePublication(dto.getDatePublication());
        order.setConfirmed(false);  // по умолчанию не подтверждён
        order.setReader(reader);

        OrderCatalog saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    public List<OrderResponseDTO> getMyOrders(Long readerId) {
        return orderRepository.findByReaderId(readerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO confirmOrder(Long orderId) {
        OrderCatalog order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        if (order.getConfirmed()) {
            throw new IllegalStateException("Заказ уже подтверждён");
        }

        order.setConfirmed(true);
        OrderCatalog saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteOrder(Long orderId, Long readerId) {
        OrderCatalog order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        if (!order.getReader().getId().equals(readerId)) {
            throw new IllegalStateException("Нельзя удалить чужой заказ");
        }

        if (order.getConfirmed()) {
            throw new IllegalStateException("Нельзя удалить подтверждённый заказ");
        }

        orderRepository.delete(order);
    }

    @Transactional
    public OrderResponseDTO updateOrder(Long orderId, OrderCreateDTO dto, Long readerId) {
        OrderCatalog order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Заказ не найден"));

        if (!order.getReader().getId().equals(readerId)) {
            throw new IllegalStateException("Нельзя редактировать чужой заказ");
        }

        if (order.getConfirmed()) {
            throw new IllegalStateException("Нельзя редактировать подтверждённый заказ");
        }

        order.setTitle(dto.getTitle());
        order.setAuthorSurname(dto.getAuthorSurname());
        order.setAuthorName(dto.getAuthorName());
        order.setAuthorPatronymic(dto.getAuthorPatronymic());
        order.setQuantyti(dto.getQuantity());
        order.setDatePublication(dto.getDatePublication());

        OrderCatalog saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    private OrderResponseDTO convertToDTO(OrderCatalog order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setTitle(order.getTitle());
        dto.setAuthorSurname(order.getAuthorSurname());
        dto.setAuthorName(order.getAuthorName());
        dto.setAuthorPatronymic(order.getAuthorPatronymic());
        dto.setQuantity(order.getQuantyti());  // опечатка в БД!
        dto.setDatePublication(order.getDatePublication());
        dto.setConfirmed(order.getConfirmed());
        dto.setReaderId(order.getReader().getId());
        return dto;
    }
}