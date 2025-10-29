package ru.kafpin.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kafpin.pojos.BooksCatalog;
import jakarta.validation.constraints.NotNull;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookUpdateDTO extends BookCreateDTO{

    @NotNull(message = "ID книги не может быть пустым")
    private Long id;

    public void updateEntity(BooksCatalog book) {
        book.setIndex(this.getIndex());
        book.setAuthorsMark(this.getAuthorsMark());
        book.setTitle(this.getTitle());
        book.setPlacePublication(this.getPlacePublication());
        book.setInformationPublication(this.getInformationPublication());
        book.setVolume(this.getVolume());
        book.setQuantityTotal(this.getQuantityTotal());
        book.setQuantityRemaining(this.getQuantityRemaining());
        book.setCover(this.getCover());
        book.setDatePublication(this.getDatePublication());
    }
}
