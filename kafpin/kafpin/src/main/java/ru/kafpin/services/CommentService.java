package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.CommentCreateDTO;
import ru.kafpin.dtos.CommentUpdateDTO;
import ru.kafpin.pojos.Comments;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.CommentsRepository;
import ru.kafpin.repositories.ReadersCatalogRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentsRepository commentRepository;
    private final ReadersCatalogRepository readersCatalogRepository;

    public List<Comments> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comments> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Transactional
    public Comments createComment(CommentCreateDTO createDTO, String username) {
        ReadersCatalog user = readersCatalogRepository.findByLogin(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Comments comment = new Comments();
        comment.setComment(createDTO.getComment());
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    @Transactional
    public Comments updateComment(Long commentId, CommentUpdateDTO updateDTO, String username) {
        Comments comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));

        // Проверяем, что пользователь редактирует свой комментарий
        if (!comment.getUser().getLogin().equals(username)) {
            throw new RuntimeException("Вы можете редактировать только свои комментарии");
        }

        comment.setComment(updateDTO.getComment());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comments comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));

        // Проверяем, что пользователь удаляет свой комментарий
        if (!comment.getUser().getLogin().equals(username)) {
            throw new RuntimeException("Вы можете удалять только свои комментарии");
        }

        commentRepository.delete(comment);
    }
}