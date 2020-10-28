package com.victory.notes.repos;

import com.victory.notes.entity.Note;
import com.victory.notes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepo extends JpaRepository<Note,Long> {
    List<Note> findNoteByAuthor(User user);
}
