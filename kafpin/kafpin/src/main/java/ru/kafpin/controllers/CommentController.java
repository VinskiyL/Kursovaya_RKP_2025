package ru.kafpin.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.dtos.CommentCreateDTO;
import ru.kafpin.dtos.CommentUpdateDTO;
import ru.kafpin.pojos.Comments;
import ru.kafpin.services.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<Comments> getAllComments(Authentication authentication) {
        String username = authentication.getName(); // если не авторизован - Spring выбросит исключение
        return commentService.getAllComments();
    }

    @GetMapping("/{id}")
    public Comments getCommentById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        return commentService.getCommentById(id)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));
    }

    @PostMapping
    public ResponseEntity<?> createComment(
            @Valid @RequestBody CommentCreateDTO createDTO,
            Authentication authentication) {
        String username = authentication.getName();
        Comments comment = commentService.createComment(createDTO, username);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateDTO updateDTO,
            Authentication authentication) {
        String username = authentication.getName();
        Comments updated = commentService.updateComment(id, updateDTO, username);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        commentService.deleteComment(id, username);
        return ResponseEntity.ok().body("Комментарий успешно удалён");
    }


}