package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.Comments;
import ru.kafpin.repositories.CommentsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    private final CommentsRepository commentRepository;

    @Autowired
    public CommentService(CommentsRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comments> getAllComments() {
        return commentRepository.findAll();
    }
}